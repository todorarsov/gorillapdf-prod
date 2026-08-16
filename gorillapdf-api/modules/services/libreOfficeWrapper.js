'use strict';

const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const { execFile } = require('child_process');
const { pathToFileURL } = require('url');

const SOFFICE_PATHS = {
    darwin: ['/Applications/LibreOffice.app/Contents/MacOS/soffice'],
    linux: ['/usr/bin/libreoffice', '/usr/bin/soffice'],
    win32: [
        path.join(process.env['PROGRAMFILES(X86)'] || '', 'LIBREO~1/program/soffice.exe'),
        path.join(process.env['PROGRAMFILES(X86)'] || '', 'LibreOffice/program/soffice.exe'),
        path.join(process.env.PROGRAMFILES || '', 'LibreOffice/program/soffice.exe'),
    ]
};

function findSoffice() {
    const paths = SOFFICE_PATHS[process.platform];

    if (!paths) {
        throw new Error(`Operating system not yet supported: ${process.platform}`);
    }

    const soffice = paths.find((filePath) => filePath && fs.existsSync(filePath));

    if (!soffice) {
        throw new Error('Could not find soffice binary');
    }

    return soffice;
}

function safeSourceName(sourceName, format) {
    const fallback = `source.${format === 'pdf' ? 'docx' : 'bin'}`;
    const baseName = path.basename(sourceName || fallback).replace(/[^\w.\-() ]+/g, '_');
    const withName = baseName || fallback;

    return path.extname(withName) ? withName : `${withName}.bin`;
}

function readConvertedFile(tempDir, sourceName, format, callback) {
    const expectedPath = path.join(tempDir, `${path.parse(sourceName).name}.${format}`);

    fs.readFile(expectedPath, (expectedError, buffer) => {
        if (!expectedError) {
            callback(null, buffer);
            return;
        }

        fs.readdir(tempDir, (listError, files) => {
            if (listError) {
                callback(expectedError);
                return;
            }

            const convertedName = files.find((file) => file.toLowerCase().endsWith(`.${format.toLowerCase()}`));

            if (!convertedName) {
                callback(expectedError);
                return;
            }

            fs.readFile(path.join(tempDir, convertedName), callback);
        });
    });
}

const convertWithOptions = (document, format, filter, options, callback) => {
    const tmpOptions = (options || {}).tmpOptions || {};
    const asyncOptions = (options || {}).asyncOptions || {};
    const execOptions = (options || {}).execOptions || {};
    const tempDir = tmp.dirSync({ prefix: 'libreofficeConvert_', unsafeCleanup: true, ...tmpOptions });
    const profileDir = tmp.dirSync({ prefix: 'libreofficeProfile_', unsafeCleanup: true, ...tmpOptions });
    const sourceName = safeSourceName((options || {}).sourceName, format);
    const sourcePath = path.join(tempDir.name, sourceName);

    try {
        const soffice = findSoffice();

        fs.writeFile(sourcePath, document, (writeError) => {
            if (writeError) {
                tempDir.removeCallback();
                profileDir.removeCallback();
                callback(writeError);
                return;
            }

            const outputFormat = filter ? `${format}:${filter}` : format;
            const userInstallation = pathToFileURL(profileDir.name).href;
            const args = [
                '--headless',
                '--nologo',
                '--nofirststartwizard',
                '--nolockcheck',
                '--nodefault',
                `-env:UserInstallation=${userInstallation}`,
                '--convert-to',
                outputFormat,
                '--outdir',
                tempDir.name,
                sourcePath
            ];

            execFile(soffice, args, {
                timeout: execOptions.timeout || 120000,
                maxBuffer: execOptions.maxBuffer || 1024 * 1024 * 10,
                env: {
                    ...process.env,
                    HOME: profileDir.name
                }
            }, (convertError, stdout, stderr) => {
                if (convertError) {
                    tempDir.removeCallback();
                    profileDir.removeCallback();
                    convertError.message = `${convertError.message}\nstdout: ${stdout}\nstderr: ${stderr}`;
                    callback(convertError);
                    return;
                }

                let attempts = 0;
                const maxAttempts = asyncOptions.times || 10;
                const interval = asyncOptions.interval || 250;

                const load = () => {
                    attempts += 1;
                    readConvertedFile(tempDir.name, sourceName, format, (readError, buffer) => {
                        if (!readError) {
                            tempDir.removeCallback();
                            profileDir.removeCallback();
                            callback(null, buffer);
                            return;
                        }

                        if (attempts >= maxAttempts) {
                            tempDir.removeCallback();
                            profileDir.removeCallback();
                            readError.message = `${readError.message}\nstdout: ${stdout}\nstderr: ${stderr}`;
                            callback(readError);
                            return;
                        }

                        setTimeout(load, interval);
                    });
                };

                load();
            });
        });
    } catch (error) {
        tempDir.removeCallback();
        profileDir.removeCallback();
        callback(error);
    }
};

const convert = (document, format, filter, callback) => {
    return convertWithOptions(document, format, filter, {}, callback);
};

module.exports = {
    convert,
    convertWithOptions
};
