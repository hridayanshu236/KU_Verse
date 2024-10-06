const DataURIParser = require("datauri/parser");
const path = require("path");

const getDataURL = (file)=>{
    const parser = new DataURIParser();
    const ext = path.extname(file.originalname).toString();

    return parser.format(ext, file.buffer);
}

module.exports = getDataURL;