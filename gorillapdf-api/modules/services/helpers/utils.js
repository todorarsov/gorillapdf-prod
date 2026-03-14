const getDefaultFonts = ()  => {
    let fonts = {
        Roboto: {
            normal: 'fonts/Roboto-Regular.ttf',
            bold: 'fonts/Roboto-Medium.ttf',
            italics: 'fonts/Roboto-Italic.ttf',
            bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
    };
    return fonts;
}

const txtDefaultConfig = () => {
    const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
    };
    return config;
}

const getPercentageChange = (oldNumber, newNumber) => {
    let decreaseValue = oldNumber - newNumber;
    return(decreaseValue / oldNumber) * 100;
}

const generateCompressPdfCommand = (compressLevel, inputPath, outputPath) => `ghostscript -q -dNOPAUSE -dBATCH 
-dSAFER -dSimulateOverprint=true -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dEmbedAllFonts=true -dSubsetFonts=true 
-dAutoRotatePages=/None -dColorImageDownsampleType=/Bicubic -dColorImageResolution=
    ${compressLevel} -dGrayImageDownsampleType=/Bicubic -dGrayImageResolution= ${compressLevel} 
    -dMonoImageDownsampleType=/Bicubic -dMonoImageResolution=
    ${compressLevel} -sOutputFile=' ${outputPath} ${inputPath}`;

const bytesToSize = bytes => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if(bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if(i === 0) return `${bytes} ${sizes[i]}`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

const setCompressionType = type => {
    let mappedValue = 0;
    switch(type) {
        case "low":
            { mappedValue = 150; }
            break;
        case "medium":
            { mappedValue = 120; }
            break;
        case "high":
            { mappedValue = 80; }
            break;
        case "very high":
            { mappedValue = 50; }
            break;
        default:
            mappedValue = 120;
    }
    return mappedValue;
}
const newFileIsLarger = (fileProcessedSize, fileInitialSize) => fileProcessedSize >= fileInitialSize ? true : false

module.exports = {
    getDefaultFonts,
    generateCompressPdfCommand,
    txtDefaultConfig,
    getPercentageChange,
    bytesToSize,
    setCompressionType,
    newFileIsLarger,
}