import puppeteer from "puppeteer";
import { v4 as uuid } from "uuid";

export async function generatePDF(html) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const fileName = uuid() + ".pdf";
  const pdfPath = `uploads/${fileName}`;

  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return pdfPath;
}
