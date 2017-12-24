var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;

var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://127.0.0.1:27017/MDfilesdb";

app.use(express.static(__dirname));

app.get("/api/files", function (req, res) {

    mongoClient.connect(url, function (err, db) {
        db.collection("files").find({}).toArray(function (err, files) {
            if (err) {
                console.error(err);
                return res.status(400).send();
            }
            res.send(files)
            db.close();
        });
    });
});

app.get("/api/files/:id", function (req, res) {

    var id = new objectId(req.params.id);
    mongoClient.connect(url, function (err, db) {
        db.collection("files").findOne({ _id: id }, function (err, file) {

            if (err) {
                console.error(err);
                return res.status(400).send();
            }
            res.send(file);
            db.close();
        });
    });
});

app.post("/api/files", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    var fileName = req.body.body.fileName;
    var fileData = req.body.body.fileData;
    var file = { fileName: fileName, fileData: fileData };

    mongoClient.connect(url, function (err, db) {
        db.collection("files").insertOne(file, function (err, result) {

            if (err) {
                console.error(err);
                return res.status(400).send();
            }

            res.send(file);
            db.close();
        });
    });
});

app.delete("/api/files/:id", function (req, res) {

    var id = new objectId(req.params.id);
    mongoClient.connect(url, function (err, db) {
        db.collection("files").findOneAndDelete({ _id: id }, function (err, result) {

            if (err) {
                console.error(err);
                return res.status(400).send();
            }

            var file = result.value;
            res.send(file);
            db.close();
        });
    });
});

app.put("/api/files", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    var id = new objectId(req.body.body.id);
    var fileName = req.body.body.fileName;
    var fileData = req.body.body.fileData;

    mongoClient.connect(url, function (err, db) {
        db.collection("files").findOneAndUpdate({ _id: id }, { $set: { fileData: fileData, fileName: fileName } },
            { returnOriginal: false }, function (err, result) {

                if (err) {
                    console.error(err);
                    return res.status(400).send();
                }
                var file = result.value;
                res.send(file);
                db.close();
            });
    });
});

try {
    app.listen(8000, function () {
    });
}
catch (err) {
    console.error(err);
}
