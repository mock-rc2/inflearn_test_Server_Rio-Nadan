const hls = require("hls-server");
const fs = require("fs");

exports.run = async function(dirPath, server) {
    return new hls(server, {
        provider: {
            exists: (req, cb) => {
                const ext = req.url.split('.').pop();

                if(ext !== 'm3u8' && ext !== 'ts') {
                    return cb(null, true);
                }

                fs.access(dirPath + req.url, fs.constants.F_OK, function(err) {
                    if(err) {
                        console.log('File not exist');
                        return cb(new Error("Server error!"), false);
                    }
                    cb(null, true);
                });
            },
            getManifestStream:(req, cb) => {
                const stream = fs.createReadStream(dirPath + req.url);
                cb(null, stream);
            },
            getSegmentStream:(req, cb) => {
                const stream = fs.createReadStream(dirPath + req.url);
                cb(null, stream)
            }
        }
    });
}