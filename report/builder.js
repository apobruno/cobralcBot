const PDFDocument = require("pdfkit");
const fs = require("fs");
const doc = new PDFDocument();

const buildPdf = function(store) {
  //Cabeçalho
  doc
    .image("./assets/logo.jpg", 270, 10, {
      fit: [80, 80],
      align: "center"
    })
    .moveDown(2.5);

  doc
    .font("Courier-Bold")
    .fontSize(24)
    .text(
      `Reunião Cobralc ${store.date.day}-${store.date.month}-${store.date.year}`,
      {
        align: "center"
      }
    )
    .moveDown(1.5);

  //Presentes
  doc
    .font("Courier-Bold")
    .fontSize(14)
    .text(`Presentes: `, {
      align: "left"
    })
    .moveDown(1);

  store.singUp.forEach((person, index) => {
    doc
      .font("Courier")
      .fontSize(12)
      .text(`${index + 1}) ${person}`, {
        align: "left"
      })
      .moveDown(0.5);
  });

  doc.moveDown(1);

  //Pontos discutidos
  doc
    .font("Courier-Bold")
    .fontSize(14)
    .text(`Pontos Discutidos:`, {
      align: "left"
    })
    .moveDown(1);

  store.points.forEach((point, index) => {
    doc
      .font("Courier")
      .fontSize(12)
      .text(`${index + 1}) ${point.point}`, {
        align: "left"
      })
      .moveDown(0.5);
    doc
      .font("Courier")
      .fontSize(12)
      .text(`${point.description}`, {
        align: "left"
      })
      .moveDown(0.5);
  });

  doc.moveDown(1);

  //Tarefas
  doc
    .font("Courier-Bold")
    .fontSize(14)
    .text(`Tarefas Propostas`, {
      align: "left"
    })
    .moveDown(1);

  store.tasks.forEach((task, index) => {
    doc
      .font("Courier")
      .fontSize(12)
      .text(`${index + 1})`, {
        align: "left"
      })
      .moveDown(0.5);
    doc
      .font("Courier")
      .fontSize(12)
      .text(`Tarefa: ${task.task}`, {
        align: "left"
      })
      .moveDown(0.5);
    doc
      .font("Courier")
      .fontSize(12)
      .text(`Responsável: ${task.manager}`, {
        align: "left"
      })
      .moveDown(0.5);
    doc
      .font("Courier")
      .fontSize(12)
      .text(`Prazo: ${task.deadline}`, {
        align: "left"
      })
      .moveDown(0.5);
  });

  doc.pipe(
    fs.createWriteStream(
      `./atacobralc${store.date.day}-${store.date.month}-${store.date.year}.pdf`
    )
  );
  doc.end();
};

module.exports = buildPdf;
