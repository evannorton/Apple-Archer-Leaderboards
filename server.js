require("dotenv").config();

process.on("uncaughtException", (err) => {
    console.log("Caught exception: " + err);
});

process.on("unhandledRejection", (err) => {
    console.log("Caught rejection: " + err);
});

const express = require("express");

const sequelize = require("./sequelize");

sequelize.sync({ alter: true }).then(() => {

    const app = require("next")({ dev: process.env.NODE_ENV === "development" });

    app.prepare().then(() => {

        const server = express();

        server.use(require("compression")(), express.json(), (req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", `${req.protocol}://${req.get("host")}`);
            res.setHeader("Cache-Control", "no-store");
            next();
        });

        server.post("/api/scores", require("body-parser").json(), (req, res) => {
            if (req.headers["x-api-key"] !== process.env.API_KEY) {
                res.sendStatus(403);
            }
            else {
                const { name, score } = req.body;
                try {
                    sequelize.models.scores.findOne({ where: { name } }).then((row) => {
                        if (row) {
                            sequelize.models.scores.update({ score, scoredAt: new Date }, { where: { name } }).then(() => {
                                res.sendStatus(200);
                            });
                        }
                        else {
                            sequelize.models.scores.create({ name, score }).then(() => {
                                res.sendStatus(200);
                            });
                        }
                    });
                }
                catch (e) {
                    console.log(e);
                    res.sendStatus(400);
                }
            }
        });

        server.get("*", (req, res) => app.getRequestHandler()(req, res));

        server.listen(process.env.PORT, () => {
            console.log(`Ready on port ${process.env.PORT}`);
        });

    });

});