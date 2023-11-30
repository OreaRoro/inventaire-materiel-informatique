const History = require('../models/History');
const PDF = require('pdfkit-construct');

//Retrieve all Histories
exports.find = (req, res) => {
    History
        .find()
        .populate({
            path: 'materiel',
            populate: {path: 'category'}
        })
        .populate('employe')
        .populate('utilisateur')
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
}

// Create History
exports.create = (req, res) => {
    const history = new History({
        materiel: req.body.materiel,
        employe: req.body.employe,
        utilisateur: req.body.utilisateur,
        action: req.body.action
    });
    history
        .save(history)
        .then(response => {
            res.send(response);
        })
        .catch(e => {
            console.log(e);
        })
}

// Generate PDF
exports.generatepdf = (req, res) => {
    try {
        History
            .find()
            .populate({
                path: 'materiel',
                populate: {path: 'category'}
            })
            .populate('employe')
            .populate('utilisateur')
            .then(data => {
                const product = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].action !== "Retourné") {
                        let empl = (data[i].employe) ? data[i].employe.name : 'Employé supprimé';
                        let obj = {
                            employe: empl,
                            materiel: (data[i].materiel) ? data[i].materiel.designation : 'Matériel Supprimé',
                            category: (data[i].materiel) ? data[i].materiel.category.title: 'Matériel Supprimé',
                            status: data[i].action,
                            date: new Date(data[i].createdAt).toLocaleString('fr')
                        };
                        product.push(obj);
                    }

                }
                //Create a document
                const doc = new PDF({
                    size: 'A4',
                    margins: {top: 10, left: 10, right: 10, bottom: 20},
                    bufferPages: true
                });

                //Set Header to render in every page
                doc.setDocumentHeader({}, () => {
                    doc.lineJoin('miter')
                        .rect(0, 0, doc.page.width, doc.header.options.heightNumber)
                        .fill('#fff');

                    doc.fill("#000")
                        .fontSize(20)
                        .text("Historiques des demandes", doc.header.x + 170, doc.header.y + 30)
                });

                //Set the Footer to render in every page
                doc.setDocumentFooter({}, () => {
                    doc.lineJoin('miter')
                        .rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber)
                        .fill("#fff");
                    doc.fill("#000")
                        .fontSize(8)
                        .text(`${new Date().getFullYear()}`, doc.footer.x + 500, doc.footer.y + 10);
                });
                //Add table
                doc.addTable([
                        {key: 'employe', label: 'Employé', align: 'center'},
                        {key: 'materiel', label: 'Matériels', align: 'center'},
                        {key: 'category', label: 'Catégories', align: 'center'},
                        {key: 'status', label: 'Status', align: 'center'},
                        {key: 'date', label: 'Date', align: 'center'}
                    ],
                    product, {
                        border: {size: 0.1, color: "#000"},
                        width: "fill_body",
                        striped: false,
                        stripedColors: ["#f6f6f6", "#d6c4dd"],
                        cellsPadding: 10,
                        marginLeft: 45,
                        marginRight: 45,
                        headAlign: 'center'
                    });
                //render table
                doc.render();
                //doc.setPageNumbers((p, c) => `Page ${p} sur ${c}`, "top right");
                doc.pipe(res);
                doc.end();
            })
            .catch(error => {
                console.log(error);
            })
    } catch (e) {
        console.log(e)
    }
}

exports.generatepdfRetour = (req, res) => {
    try {
        History
            .find()
            .populate({
                path: 'materiel',
                populate: {path: 'category'}
            })
            .populate('employe')
            .populate('utilisateur')
            .then(data => {
                const product = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].action === "Retourné") {
                        let empl = (data[i].employe) ? data[i].employe.name : 'Employé supprimé';
                        let obj = {
                            employe: empl,
                            materiel: (data[i].materiel) ? data[i].materiel.designation : 'Matériel Supprimé',
                            category: (data[i].materiel) ? data[i].materiel.category.title: 'Matériel Supprimé',
                            status: data[i].action,
                            date: new Date(data[i].createdAt).toLocaleString('fr')
                        };
                        product.push(obj);
                    }

                }
                //Create a document
                const doc = new PDF({
                    size: 'A4',
                    margins: {top: 10, left: 10, right: 10, bottom: 20},
                    bufferPages: true
                });

                //Set Header to render in every page
                doc.setDocumentHeader({}, () => {
                    doc.lineJoin('miter')
                        .rect(0, 0, doc.page.width, doc.header.options.heightNumber)
                        .fill('#fff');

                    doc.fill("#000")
                        .fontSize(20)
                        .text("Matériels retournés", doc.header.x + 195, doc.header.y + 30)
                });

                //Set the Footer to render in every page
                doc.setDocumentFooter({}, () => {
                    doc.lineJoin('miter')
                        .rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber)
                        .fill("#fff");
                    doc.fill("#000")
                        .fontSize(8)
                        .text(`${new Date().getFullYear()}`, doc.footer.x + 500, doc.footer.y + 10);
                });
                //Add table
                doc.addTable([
                        {key: 'employe', label: 'Employé', align: 'center'},
                        {key: 'materiel', label: 'Matériels', align: 'center'},
                        {key: 'category', label: 'Catégories', align: 'center'},
                        {key: 'status', label: 'Status', align: 'center'},
                        {key: 'date', label: 'Date', align: 'center'}
                    ],
                    product, {
                        border: {size: 0.1, color: "#000"},
                        width: "fill_body",
                        striped: false,
                        stripedColors: ["#f6f6f6", "#d6c4dd"],
                        cellsPadding: 10,
                        marginLeft: 45,
                        marginRight: 45,
                        headAlign: 'center'
                    });
                //render table
                doc.render();
                //doc.setPageNumbers((p, c) => `Page ${p} sur ${c}`, "top right");
                doc.pipe(res);
                doc.end();
            })
            .catch(error => {
                console.log(error);
            })
    } catch (e) {
        console.log(e)
    }
}