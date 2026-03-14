const compressPdfCommand = (compressLevel, inputPath, outputPath) => `ghostscript -q -dNOPAUSE -dBATCH 
-dSAFER -dSimulateOverprint=true -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dEmbedAllFonts=true -dSubsetFonts=true 
-dAutoRotatePages=/None -dColorImageDownsampleType=/Bicubic -dColorImageResolution=${compressLevel} -dGrayImageDownsampleType=/Bicubic 
-dGrayImageResolution=${compressLevel} -dMonoImageDownsampleType=/Bicubic -dMonoImageResolution=${compressLevel} -sOutputFile=${outputPath} ${inputPath}`;
 // /let cmd = 'ghostscript -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/printer -dNOPAUSE -dQUIET -dBATCH -sOutputFile=' + outputPath + ' ' + enterPath; let command = 'qpdf --show-encryption ' + enterPath;

 const encryptPdfCommand = (pwd, enterPath, outputPath) => 'qpdf --encrypt ' + pwd + ' ' + pwd + ' ' + '256' + ' -- ' + enterPath + ' ' + outputPath;

 const decryptPdfCommand = (pwd, enterPath, outputPath )=> `qpdf --decrypt --password=${pwd} -- ${enterPath} ${outputPath}`;
 
 const pdfToDocxCommand = (enterPath, outputPath )=> `pdf2docx convert ${enterPath} ${outputPath}`;

 module.exports = {
    compressPdfCommand,
    decryptPdfCommand,
    encryptPdfCommand,
    pdfToDocxCommand
}