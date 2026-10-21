import { expect, test, type Page } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { generatePackages } from '../src/data/packageGenerator';

test('B1 uses one blank for each illustrated group, with a matching answer', () => {
  const groupCounts = new Set<number>();
  for (const maxFactor of [5, 10]) {
    for (let seed = 20240; seed < 20440; seed += 1) {
      for (const pkg of generatePackages(maxFactor, seed, 'konsep')) {
        const question = pkg.short[0];
        const picture = question.illustration!;
        expect(pkg.mc).toHaveLength(10);
        expect(pkg.short).toHaveLength(5);
        expect(question.question).toBe('Perhatikan gambar!');
        expect(question.instructionAfterIllustration).toBe(
          'Tuliskan bentuk penjumlahan berulang, bentuk perkaliannya, serta hasil perkaliannya.',
        );
        expect(question.answerTemplate).toBe(
          `${Array(picture.groups).fill('....').join(' + ')} = .... \u00d7 .... = ....`,
        );
        expect(question.answer).toBe(
          `${Array(picture.groups).fill(picture.perGroup).join(' + ')} = ${picture.groups} \u00d7 ${picture.perGroup} = ${picture.groups * picture.perGroup}`,
        );
        groupCounts.add(picture.groups);
      }
    }
  }
  expect([...groupCounts].sort()).toEqual([2, 3, 4, 5]);
});

test('multiple choice questions retain three distinct options', () => {
  for (const mode of ['campuran', 'konsep'] as const) {
    for (let seed = 20240; seed < 20260; seed += 1) {
      for (const pkg of generatePackages(10, seed, mode)) {
        for (const question of pkg.mc) {
          expect(question.options, `${mode}, seed ${seed}, package ${pkg.packageNo}, A${question.no}`).toHaveLength(3);
          expect(new Set(question.options).size).toBe(3);
          expect(question.answerLetter).toBe('abc'[question.answerIndex]);
        }
      }
    }
  }
});

async function openGenerator(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Cetak Soal/ }).click();
  await page.getByRole('button', { name: /Khusus Konsep Dasar Perkalian/ }).click();
}

async function checkPrintLayout(page: Page, pageCount: number, pdfPath: string) {
  await page.setViewportSize({ width: 718, height: 1100 });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);

  const overflow = await page.locator('.worksheet-page').evaluateAll((sheets) => sheets.flatMap((sheet) => {
    const pageRect = sheet.getBoundingClientRect();
    const issues: string[] = [];
    for (const element of sheet.querySelectorAll('.worksheet-question, .worksheet-closing, .worksheet-pagination, .worksheet-score-box')) {
      const rect = element.getBoundingClientRect();
      if (rect.bottom > pageRect.bottom + 1 || rect.right > pageRect.right + 1 || rect.left < pageRect.left - 1) {
        issues.push(`${sheet.getAttribute('aria-label')}: ${element.className} exceeds sheet bounds`);
      }
    }
    const questions = sheet.querySelector('.worksheet-questions, .worksheet-short-questions')!;
    const ending = sheet.querySelector('.worksheet-bottom, .worksheet-pagination')!;
    if (questions.getBoundingClientRect().bottom > ending.getBoundingClientRect().top + 1) {
      issues.push(`${sheet.getAttribute('aria-label')}: questions overlap footer`);
    }
    if (sheet.scrollWidth > sheet.clientWidth + 1 || sheet.scrollHeight > sheet.clientHeight + 1) {
      issues.push(`${sheet.getAttribute('aria-label')}: content overflows`);
    }
    return issues;
  }));
  expect(overflow).toEqual([]);
  await expect(page.locator('.worksheet-page')).toHaveCount(pageCount);

  const bytes = await page.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
  const pdf = await PDFDocument.load(bytes);
  expect(pdf.getPageCount()).toBe(pageCount);
  for (const sheet of pdf.getPages()) {
    expect(sheet.getWidth()).toBeCloseTo(595, 0);
    expect(sheet.getHeight()).toBeCloseTo(842, 0);
  }

  await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 1280, height: 900 });
}

test('B1 renders prompt, picture, instruction, then dynamic blanks in that order', async ({ page }) => {
  await openGenerator(page);
  const question = page.locator('[data-question="B1"]');
  await expect(question.locator('.worksheet-question-text')).toHaveText('1. Perhatikan gambar!');
  expect(await question.evaluate((node) => Array.from(node.children, (child) => child.className))).toEqual([
    'worksheet-question-text',
    'worksheet-pictures',
    'worksheet-picture-instruction',
    'worksheet-answer-line',
  ]);
  const groups = await question.locator('.worksheet-picture-group').count();
  await expect(question.locator('.worksheet-answer-template')).toHaveText(
    `${Array(groups).fill('....').join(' + ')} = .... \u00d7 .... = ....`,
  );
  await expect(page.locator('#paket-print-area')).not.toContainText('Created by:');
  await expect(page.locator('#paket-print-area')).not.toContainText('Cerita Islami');
});

test('one package prints as two A4 pages, with the complete footer on page two', async ({ page }, testInfo) => {
  await openGenerator(page);
  await expect(page.locator('.worksheet-page--short .worksheet-closing')).toContainText('Alhamdulillah, selamat mengerjakan!');
  await expect(page.locator('.worksheet-page--short .worksheet-score-box')).toBeVisible();
  await expect(page.locator('.worksheet-page--short .worksheet-signature')).toContainText('Widodo, S.Pd.');
  await checkPrintLayout(page, 2, testInfo.outputPath('concept-two-pages.pdf'));
});

test('all five packages remain ten A4 pages across modes, limits, and answer-key settings', async ({ page }, testInfo) => {
  await openGenerator(page);
  await page.getByRole('button', { name: 'Semua (5 Paket)', exact: true }).click();
  for (const mode of ['konsep', 'campuran']) {
    await page.getByRole('button', { name: mode === 'konsep' ? /Khusus Konsep Dasar Perkalian/ : /Soal Campuran/ }).click();
    for (const limit of [5, 10]) {
      await page.getByRole('button', { name: new RegExp(`Sampai ${limit} `) }).click();
      await checkPrintLayout(page, 10, testInfo.outputPath(`${mode}-${limit}-student.pdf`));
      await page.getByRole('button', { name: 'Kunci Tidak Tercetak', exact: true }).click();
      await checkPrintLayout(page, 10, testInfo.outputPath(`${mode}-${limit}-teacher.pdf`));
      await page.getByRole('button', { name: 'Kunci Ikut Tercetak', exact: true }).click();
    }
  }
});

test('shuffled questions and long school names still fit, including a hidden-on-screen answer key', async ({ page }, testInfo) => {
  await openGenerator(page);
  await page.getByRole('button', { name: 'Semua (5 Paket)', exact: true }).click();
  await page.getByLabel('Nama sekolah (kop soal):').fill('SEKOLAH DASAR ISLAM TERPADU AL HIKMAH PENDIDIKAN ANAK INDONESIA KOTA YOGYAKARTA');
  await page.getByLabel('Nama guru (tanda tangan):').fill('Widodo Guru Kelas Dua Sekolah Dasar, S.Pd., M.Pd.');
  await page.getByRole('button', { name: 'Kunci Jawaban: Tampil', exact: true }).click();
  await page.getByRole('button', { name: 'Kunci Tidak Tercetak', exact: true }).click();
  await expect(page.locator('.worksheet-answer-key').first()).toBeHidden();
  for (let round = 0; round < 3; round += 1) {
    await page.getByRole('button', { name: 'Acak Soal Baru', exact: true }).click();
    await checkPrintLayout(page, 10, testInfo.outputPath(`shuffled-${round}.pdf`));
  }
});

test('mobile preview keeps B1 readable and print button still opens print', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openGenerator(page);
  const question = page.locator('[data-question="B1"]');
  await question.scrollIntoViewIfNeeded();
  await question.screenshot({ path: testInfo.outputPath('b1-mobile.png') });
  expect(await question.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  await page.evaluate(() => {
    window.print = () => { document.body.dataset.printCalled = 'true'; };
  });
  await page.getByRole('button', { name: 'Print Paket 1', exact: true }).click();
  await expect(page.locator('body')).toHaveAttribute('data-print-called', 'true');
});