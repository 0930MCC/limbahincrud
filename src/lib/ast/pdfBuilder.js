import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

function drawHeader(page, title, font) {
  const margin = 28;
  const top = page.getHeight();
  const width = page.getWidth();
  const size = 10;
  const headerY = top - 20;

  let display = title || "Untitled Document";
  const maxW = width - margin * 2;
  if (font.widthOfTextAtSize(display, size) > maxW) {
    while (display.length > 4 && font.widthOfTextAtSize(display + "…", size) > maxW) {
      display = display.slice(0, -1);
    }
    display += "…";
  }

  page.drawText(display, {
    x: margin,
    y: headerY,
    size,
    font,
    color: rgb(0.35, 0.35, 0.38),
    maxWidth: maxW,
  });

  page.drawLine({
    start: { x: margin, y: headerY - 5 },
    end: { x: width - margin, y: headerY - 5 },
    thickness: 0.5,
    color: rgb(0.82, 0.82, 0.85),
  });
}

async function imageToJpegBytes(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise((res) =>
      canvas.toBlob(res, "image/jpeg", 0.92)
    );
    return new Uint8Array(await blob.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function blobToJpegBytes(blob) {
  return new Uint8Array(await blob.arrayBuffer());
}

function fitImage(imgW, imgH, availW, availH) {
  const scale = Math.min(availW / imgW, availH / imgH, 1);
  return { width: imgW * scale, height: imgH * scale };
}

// `useCoverPage` (default true, matching the original always-on behavior): whether to generate
// the plain white title page in front. When false, the PDF starts directly with the first
// uploaded file's content — whatever order the files are currently in (the up/down move controls
// in AssetFiles.jsx are how you choose what ends up first, there's no separate "pick a cover"
// control anymore).
export async function buildCombinedPdf(title, files, useCoverPage = true) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  if (useCoverPage) {
    const cover = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    cover.drawRectangle({
      x: 0,
      y: 0,
      width: A4_WIDTH,
      height: A4_HEIGHT,
      color: rgb(0.97, 0.97, 0.98),
    });
    cover.drawRectangle({
      x: 0,
      y: A4_HEIGHT - 8,
      width: A4_WIDTH,
      height: 8,
      color: rgb(0.07, 0.07, 0.08),
    });

    let coverTitle = title || "Untitled Document";
    let coverSize = 40;
    while (font.widthOfTextAtSize(coverTitle, coverSize) > A4_WIDTH - 80 && coverSize > 14) {
      coverSize -= 2;
    }
    const titleY = A4_HEIGHT / 2;
    const wrapped = wrapText(coverTitle, font, coverSize, A4_WIDTH - 80, 3);
    wrapped.forEach((line, i) => {
      const y = titleY + (wrapped.length - 1 - i) * (coverSize + 6);
      cover.drawText(line, {
        x: 40,
        y,
        size: coverSize,
        font,
        color: rgb(0.07, 0.07, 0.08),
      });
    });

    cover.drawText(`${files.length} file${files.length === 1 ? "" : "s"} combined`, {
      x: 40,
      y: titleY - 50,
      size: 13,
      font: fontRegular,
      color: rgb(0.42, 0.42, 0.45),
    });

    const fileTypes = files.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    }, {});
    const summary = Object.entries(fileTypes)
      .map(([k, v]) => `${v} ${k}${v > 1 ? "s" : ""}`)
      .join("  ·  ");
    if (summary) {
      cover.drawText(summary, {
        x: 40,
        y: titleY - 72,
        size: 11,
        font: fontRegular,
        color: rgb(0.55, 0.55, 0.58),
      });
    }
  }

  // Content
  for (const item of files) {
    if (item.type === "pdf") {
      const bytes = await item.file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const copied = await pdfDoc.copyPages(src, src.getPageIndices());
      copied.forEach((p) => {
        const page = pdfDoc.addPage(p);
        drawHeader(page, title, font);
      });
    } else if (item.type === "image") {
      const jpgBytes = await imageToJpegBytes(item.file);
      const img = await pdfDoc.embedJpg(jpgBytes);
      const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      drawHeader(page, title, font);
      const { width, height } = fitImage(img.width, img.height, A4_WIDTH - 40, A4_HEIGHT - 80);
      page.drawImage(img, {
        x: (A4_WIDTH - width) / 2,
        y: 40 + (A4_HEIGHT - 80 - height) / 2,
        width,
        height,
      });
      drawCaption(page, item.file.name, fontRegular);
    } else if (item.type === "video") {
      const thumb = item.thumbnail;
      const jpgBytes = await blobToJpegBytes(thumb);
      const img = await pdfDoc.embedJpg(jpgBytes);
      const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      drawHeader(page, title, font);
      const { width, height } = fitImage(img.width, img.height, A4_WIDTH - 40, A4_HEIGHT - 80);
      const cx = (A4_WIDTH - width) / 2;
      const cy = 40 + (A4_HEIGHT - 80 - height) / 2;
      page.drawImage(img, { x: cx, y: cy, width, height });
      // play button overlay
      const pb = Math.min(width, height) * 0.15;
      const ccx = cx + width / 2;
      const ccy = cy + height / 2;
      page.drawCircle({
        x: ccx,
        y: ccy,
        radius: pb,
        color: rgb(1, 1, 1),
        opacity: 0.88,
      });
      page.drawCircle({
        x: ccx,
        y: ccy,
        radius: pb,
        borderColor: rgb(0, 0, 0),
        borderOpacity: 0.12,
        borderWidth: 1,
      });
      // play triangle (outline via lines)
      const th = pb * 0.4;
      const px = ccx - pb * 0.2;
      const tipx = ccx + pb * 0.45;
      const triColor = rgb(0.07, 0.07, 0.08);
      page.drawLine({ start: { x: px, y: ccy + th }, end: { x: px, y: ccy - th }, thickness: 2, color: triColor });
      page.drawLine({ start: { x: px, y: ccy + th }, end: { x: tipx, y: ccy }, thickness: 2, color: triColor });
      page.drawLine({ start: { x: px, y: ccy - th }, end: { x: tipx, y: ccy }, thickness: 2, color: triColor });
      drawCaption(page, `Video · ${item.file.name}`, fontRegular);
    }
  }

  const out = await pdfDoc.save();
  return new Blob([out], { type: "application/pdf" });
}

function drawCaption(page, text, font) {
  let display = text;
  const maxW = A4_WIDTH - 80;
  while (display.length > 4 && font.widthOfTextAtSize(display, 9) > maxW) {
    display = display.slice(0, -1);
  }
  if (display !== text) display += "…";
  page.drawText(display, {
    x: 40,
    y: 38,
    size: 9,
    font,
    color: rgb(0.55, 0.55, 0.58),
    maxWidth: maxW,
  });
}

function wrapText(text, font, size, maxW, maxLines) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (font.widthOfTextAtSize(test, size) > maxW && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    lines.length = maxLines;
  }
  return lines;
}