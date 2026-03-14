

module.exports.init = function () {
  //var html_to_pdf = require('html-pdf-node');

//  let file = { url: "http://yahoo.com" };

  //const fs = require('fs');
  
// let options = { format: 'A3' };
//  let dataBuffer = fs.readFileSync('gorilla.pdf');
   
// pdf(dataBuffer).then(function(data) {
 
//     // number of pages
//     console.log(data.numpages);
//     // number of rendered pages
//     console.log(data.numrender);
//     // PDF info
//     console.log(data.info);
//     // PDF metadata
//     console.log(data.metadata); 
//     // PDF.js version
//     // check https://mozilla.github.io/pdf.js/getting_started/
//     console.log(data.version);
//     // PDF text
//     console.log(data.text); 
//     fs.writeFile('helloworld.txt', data.text, function (err) {
//       if (err) return console.log(err);
//       console.log('Hello World > helloworld.txt');
//     });
        
// });



    // html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
    //   console.log("PDF Buffer:-", pdfBuffer);
    //   fs.writeFile("test.pdf", pdfBuffer, function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     console.log("The file was saved!");
    // }); 
    // });


    

    const pdf = require('pdf2html');
    const htmlDocx= require('html-docx-js');  
    const fs = require('fs');

    pdf.html('foo5.pdf', (err, html) => {
      if (err) {
        
          console.error('Conversion error: ' + err)
      } else {

         console.log(html);
         fs.writeFile("pdfToHtml.html", html, function() {
          })
        
         const docx = htmlDocx.asBlob(html);

       fs.writeFile("docXtoPdf2.docx", docx, function(err) {
        if(err) {
            return console.log(err);
      }
  })
      }
  })

  }
  require('make-runnable');