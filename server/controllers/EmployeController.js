const Employe = require('../models/Employe');
const Demande = require('../models/Demande');
const PDF = require('pdfkit-construct');

// Find All or One Employe
exports.find = (req, res) => {
    let id = req.query.id;
    try {
       if (id) {
           Employe
               .findById(id)
               .populate('fonction')
               .then(data => {
                   if(!data) {
                       console.log(`Cannot find Employe with id: ${id}`);
                   } else {
                       res.send(data);
                   }
               })
       } else {
           Employe
               .find()
               .populate('fonction')
               .then(data => {
                   if(!data) {
                       console.log(`Cannot find Employe with id: ${id}`);
                   } else {
                       res.send(data);
                   }
               })
       }
    } catch (e) {
        console.log(e);
    }
}

// Create new Employe
exports.create = (req, res) => {
    try {
        const { name, lastname, adresse, telephone, fonction } = req.body;
        console.log(req.body);
        const employe = new Employe({
            name: name,
            lastname: lastname,
            adresse: adresse,
            telephone: telephone,
            fonction: fonction
        });
        employe
            .save(employe)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                console.log(err)
            })
    } catch (e) {
        console.log(e);
    }
}

// Update Employe
exports.update = (req, res) => {
    let id = req.body.id;
    try {
         Employe
             .findByIdAndUpdate(id, req.body)
             .then(data => {
                 res.send(data);
             })
             .catch(err => {
                 console.log(err);
             })
    } catch (e) {
        console.log(e);
    }
}

// Confirm delete employe
exports.confirmDeleteEmploye = async (req, res) => {
    let id = req.body.id;
    const demande = await Demande.find().populate('employe').exec();
    const employe = await Employe.findById(id).exec();
    let response = '';

    try {
        for (let i = 0; i < demande.length; i++) {
            if (demande[i].employe.name === employe.name) {
                response += 'no-ok';
            }
        }
        res.send({message: response});
    } catch (e) {
        console.log(e);
    }
}

// Delete Employe
exports.delete = (req, res) => {
    let id = req.body.id;
    try {
        Employe
            .findByIdAndDelete(id, req.body)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                console.log(err);
            })
    } catch (e) {
        console.log(e);
    }
}

// Generate PDF
exports.generatepdf = (req, res) => {
    try {
         Employe
            .find()
            .populate('fonction')
            .then(data => {
                const product = [];
                for (let i = 0; i < data.length; i++) {
                    let obj = {name: data[i].name, lastname: data[i].lastname, telephone: data[i].telephone, adresse: data[i].adresse, fonction: data[i].fonction.title};
                    product.push(obj);
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
                        .text("Liste des employés", doc.header.x + 200, doc.header.y + 30)
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
                        {key: 'name', label: 'Nom', align: 'center'},
                        {key: 'lastname', label: 'Prénom', align: 'center'},
                        {key: 'telephone', label: 'Téléphone', align: 'center'},
                        {key: 'adresse', label: 'Addresse', align: 'center'},
                        {key: 'fonction', label: 'Fonction', align: 'center'}
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