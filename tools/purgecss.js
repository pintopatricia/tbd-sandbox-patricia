const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { read } = require("readdir");
const { safelist, skippedContentGlobs } = require("../purgecss.config");

const contentPath = process.argv[2];
const CSSFileExtension = process.argv[3];
const contentFileExtension = process.argv[4];
const data = [];

const findFilesByExtension = async (dir, ext) => {
  const matchedFiles = [];
  const files = await read(dir);

  files.forEach(file => {
    const fileExt = path.extname(file);

    if (fileExt === `.${ext}`) {
      matchedFiles.push(file);
    }
  });

  return matchedFiles;
};

const getFileSizeInKiloBytes = (filename) => {
  const stats = fs.statSync(filename);
  const fileSizeInKiloBytes = stats.size / 1024;
  return fileSizeInKiloBytes.toFixed(2);
};

const purgeFiles = (files) => {
  if (!files && files.length <= 0) {
    console.log("cannot find style files to purge");
    return;
  }

  files.forEach((file) => {
    console.log("PurgeCSS - ", file);

    const { dir: folderName, name: filenameWithoutExt } = path.parse(file);

    const originalSize = `${getFileSizeInKiloBytes(`${contentPath}/${file}`)  }kb`;

    const finalSafelist = `svg a b button span white blue pink class last-child ${safelist.join(" ")}`;
    execSync(
      `purgecss --css ${contentPath}/${folderName}/${filenameWithoutExt}${CSSFileExtension} `+
      `--content ${contentPath}/${folderName}/${filenameWithoutExt}${contentFileExtension} ` +
      `--output ${contentPath}/${folderName} ` +
      `--safelist ${finalSafelist} ` +
      `--skippedContentGlobs ${skippedContentGlobs.join(" ")}`
    );

    const newSize = `${getFileSizeInKiloBytes(`${contentPath}/${file}`)  }kb`;

    if(newSize < originalSize) {
      data.push({
        file,
        originalSize,
        newSize
      });
    }
  });
};

(async function run(){
  console.log(`\nPurgeCSS Started for this directory - '${contentPath}'\n`);


  const files = await findFilesByExtension(`${contentPath}`, "css");

  purgeFiles(files);

  console.log("\nList of Cleaned Files\n");

  console.table(data);

  console.log("\nPurgeCSS done!\n");
})();
