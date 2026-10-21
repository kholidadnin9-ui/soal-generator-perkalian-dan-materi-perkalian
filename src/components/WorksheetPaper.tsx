import type { GeneratedPackage, Illustration } from '../data/packageGenerator';
import './WorksheetPaper.css';

interface WorksheetPaperProps {
  pkg: GeneratedPackage;
  schoolName: string;
  teacherName: string;
  maxFactor: number;
  showKey: boolean;
  includeKeyInPrint: boolean;
}

function PictureGroups({ illustration }: { illustration: Illustration }) {
  return (
    <div
      className="worksheet-pictures"
      role="img"
      aria-label={`${illustration.groups} kelompok, masing-masing berisi ${illustration.perGroup} benda`}
    >
      {Array.from({ length: illustration.groups }, (_, groupIndex) => (
        <div className="worksheet-picture-group" key={groupIndex} aria-hidden="true">
          <div className="worksheet-picture-items">
            {Array.from({ length: illustration.perGroup }, (_, itemIndex) => (
              <span key={itemIndex}>{illustration.emoji}</span>
            ))}
          </div>
          <p className="worksheet-picture-label">
            {illustration.containerLabel} {groupIndex + 1}
          </p>
        </div>
      ))}
    </div>
  );
}

function AnswerKey({ pkg }: { pkg: GeneratedPackage }) {
  return (
    <aside className="worksheet-answer-key" aria-label={`Kunci jawaban paket ${pkg.packageNo}`}>
      <h4>KUNCI JAWABAN - PAKET {pkg.packageNo} (khusus guru)</h4>
      <div className="worksheet-key-columns">
        <div>
          <p className="worksheet-key-heading">A. Pilihan Ganda</p>
          <div className="worksheet-key-mc">
            {pkg.mc.map((question) => (
              <p key={question.no}>
                {question.no}. <strong>{question.answerLetter}</strong>
                <span className="worksheet-key-explanation"> ({question.options[question.answerIndex]})</span>
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="worksheet-key-heading">B. Isian Singkat</p>
          {pkg.short.map((question) => (
            <p key={question.no}>{question.no}. {question.answer}</p>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function WorksheetPaper({
  pkg,
  schoolName,
  teacherName,
  maxFactor,
  showKey,
  includeKeyInPrint,
}: WorksheetPaperProps) {
  const title = pkg.mode === 'konsep'
    ? `LATIHAN KONSEP DASAR PERKALIAN - PAKET ${pkg.packageNo}`
    : `LATIHAN PERKALIAN - PAKET ${pkg.packageNo} (1-${maxFactor})`;

  return (
    <article className="worksheet-package" aria-label={`Lembar soal paket ${pkg.packageNo}`}>
      <section className="worksheet-page worksheet-page--multiple" aria-label="Halaman 1 dari 2">
        <header className="worksheet-heading">
          <p className="worksheet-school">{schoolName}</p>
          <h3>{title}</h3>
          <p className="worksheet-subtitle">Matematika Kelas 2 SD | 10 Pilihan Ganda + 5 Isian Singkat</p>
        </header>

        <div className="worksheet-student">
          <p>Nama: ..................................</p>
          <p>Kelas: ............</p>
          <p>No. Absen: ............</p>
          <p>Tanggal: ................</p>
        </div>
        <p className="worksheet-reminder">
          Bacalah basmalah sebelum mengerjakan. Kerjakan dengan jujur dan teliti!
        </p>

        <h4 className="worksheet-section-title">Bagian A - Pilihan Ganda</h4>
        <p className="worksheet-directions">Berilah tanda silang (x) pada huruf a, b, atau c di jawaban yang benar!</p>
        <div className="worksheet-questions">
          {pkg.mc.map((question) => (
            <div className="worksheet-question" key={question.no} data-question={`A${question.no}`}>
              <p className="worksheet-question-text"><strong>{question.no}.</strong> {question.question}</p>
              {question.illustration && <PictureGroups illustration={question.illustration} />}
              <div className="worksheet-options">
                {question.options.map((option, index) => (
                  <p key={index}><strong>{'abc'[index]}.</strong> {option}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="worksheet-pagination">Paket {pkg.packageNo} | Halaman 1 dari 2</p>
      </section>

      <section className="worksheet-page worksheet-page--short" aria-label="Halaman 2 dari 2">
        <header className="worksheet-continuation">
          <div>
            <p className="worksheet-school">{schoolName}</p>
            <p>Matematika Kelas 2 SD - Paket {pkg.packageNo} (lanjutan)</p>
          </div>
          <p>Nama: ..................................</p>
        </header>
        <h4 className="worksheet-section-title">Bagian B - Isian Singkat</h4>
        <p className="worksheet-directions">Isilah titik-titik di bawah ini dengan jawaban yang benar!</p>
        <div className="worksheet-short-questions">
          {pkg.short.map((question) => (
            <div className="worksheet-question" key={question.no} data-question={`B${question.no}`}>
              <p className="worksheet-question-text"><strong>{question.no}.</strong> {question.question}</p>
              {question.illustration && <PictureGroups illustration={question.illustration} />}
              {question.instructionAfterIllustration && (
                <p className="worksheet-picture-instruction">{question.instructionAfterIllustration}</p>
              )}
              <div className="worksheet-answer-line">
                <span>Jawab:</span>
                {question.answerTemplate ? (
                  <span className="worksheet-answer-template">{question.answerTemplate}</span>
                ) : (
                  <span className="worksheet-writing-line" aria-label="Tempat menulis jawaban" />
                )}
              </div>
            </div>
          ))}
        </div>

        {(showKey || includeKeyInPrint) && (
          <div className={`${showKey ? '' : 'worksheet-key-screen-hidden'} ${includeKeyInPrint ? '' : 'no-print'}`}>
            <AnswerKey pkg={pkg} />
          </div>
        )}

        <div className="worksheet-bottom">
          <footer className="worksheet-closing">
            <div className="worksheet-signature">
              <p>Guru Kelas 2,</p>
              <div className="worksheet-signature-space" aria-label="Tempat tanda tangan guru" />
              <p className="worksheet-teacher">{teacherName}</p>
            </div>
            <div className="worksheet-score">
              <p>Nilai</p>
              <div className="worksheet-score-box" aria-label="Kotak nilai" />
            </div>
            <p className="worksheet-closing-message">Alhamdulillah, selamat mengerjakan!</p>
          </footer>
          <p className="worksheet-pagination">Paket {pkg.packageNo} | Halaman 2 dari 2</p>
        </div>
      </section>
    </article>
  );
}