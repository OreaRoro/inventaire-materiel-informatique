function add() {
    save_method = "add";
    $("#form")[0].reset(); // reset form on modals
    $(".modal").modal("show"); // show bootstrap modal
    $(".modal-title").text("Formulaire de démande"); // Set Title to Bootstrap modal title
}

function save() {
    let btn = $('#btnSave');
    btn.text('Enregistrement...'); //change button text
    btn.attr('disabled', true); //set button disable

   const form = $("#form");
   const unindexed_array = form.serializeArray();
    let data = {};
    $.map(unindexed_array, function(n, i) {
        data[n['name']] = n['value'];
    });
    let employeInput = $('#employe');
    let materielInput = $('#materiel');
    let dateInput = $('#dateRetour');


    if (data.employe === '' && data.materiel === '' && data.dateRetour === '') {
        swal.fire({
            title: 'Formulaire vide',
            text: 'Veuillez remplir les formulaires s\'il vous plaît',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    } else if (data.employe === '') {
        employeInput.addClass('is-invalid');
        $('#error_name').text('Ce champ est requis');
    } else if (data.materiel === '') {
        materielInput.addClass('is-invalid');
        $('#error_lastname').text('Ce champ est requis');
    } else if (data.dateRetour === '') {
        dateInput.addClass('is-invalid');
        $('#error_adresse').text('Ce champ est requis');
    } else {
        $.ajax({
            url: '/api/demande',
            method: 'POST',
            data: data,
            dataType: 'JSON',
            success: function (res) {
                console.log(res);
                $.ajax({
                    url: '/api/history',
                    method: 'POST',
                    data: {
                        materiel: res.materiel,
                        employe: res.employe,
                        utilisateur: $('#utilisateur').val(),
                        action: "En attente"
                    },
                    success: function (response) {
                        console.log(response);
                    },
                    error: function (e) {
                        console.log(e);
                    }
                })
                if(res) {
                    swal.fire({
                        title: 'Succès',
                        text: 'Demande effectué avec succès.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    })
                        .then(resultat => {
                            if(resultat.isConfirmed) {
                                location.reload();
                            }
                        })
                }
            },
            error: function (err) {
                if (err.responseJSON.error.idmateriel) {
                    Swal.fire({
                        title: 'info',
                        text: err.responseJSON.error.idmateriel,
                        icon: "info",
                        confirmButtonText: "OK"
                    });
                }
                btn.text("Enregistrer"); //change button text
                btn.attr("disabled", false); //set button enable

            }
        })
    }


}

if (window.location.pathname === '/demande') {
    $onaccept = $(".table tbody td button.accept");
    $onaccept.click(function () {
        let iddemande = $(this).attr('data-iddemand');
        let idmateriel = $(this).attr('data-idmateriel');
        let idemploye = $(this).attr('data-idemploye');
        $.ajax({
            url: '/api/history',
            method: 'POST',
            data: {
                materiel: idmateriel,
                employe: idemploye,
                utilisateur: $('#utilisateur').val(),
                action: "Accepté"
            },
            success: function (response) {
                console.log(response);
            },
            error: function (e) {
                console.log(e);
            }
        })

        Swal.fire({
            title: "Accepter",
            text:"Êtes-vous vraiment sûr?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Accepter",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/accept',
                    method: 'post',
                    data: {
                        iddemande: iddemande,
                        idmateriel: idmateriel
                    },
                    dataType: 'JSON',
                    success: function (res) {
                        Swal.fire({
                            title:"Info",
                            text: "Demande accepté.",
                            icon: "info",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    },
                    error: function (e) {
                        console.log(e);
                    }
                })
            }
        });
    });

    $onpending = $(".table tbody td button.pending");
    $onpending.click(function () {
        let iddemande = $(this).attr('data-iddemand');
        let idmateriel = $(this).attr('data-idmateriel');


        Swal.fire({
            title: "Mise en attente",
            text: "Êtes-vous vraiment sûr?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Attente",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/pending',
                    method: 'post',
                    data: {
                        iddemande: iddemande,
                        idmateriel: idmateriel
                    },
                    dataType: 'JSON',
                    success: function (res) {
                        Swal.fire({
                            title:"Info",
                            text: "Demande mise en attente.",
                            icon: "info",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    },
                    error: function (e) {
                        console.log(e);
                    }
                })
            }
        });
    });

    $oncancel = $(".table tbody td button.cancel");
    $oncancel.click(function () {
        let iddemande = $(this).attr('data-iddemand');
        let idmateriel = $(this).attr('data-idmateriel');
        let idemploye = $(this).attr('data-idemploye');
        $.ajax({
            url: '/api/history',
            method: 'POST',
            data: {
                materiel: idmateriel,
                employe: idemploye,
                utilisateur: $('#utilisateur').val(),
                action: "Refusé"
            },
            success: function (response) {
                console.log(response);
            },
            error: function (e) {
                console.log(e);
            }
        })

        Swal.fire({
            title: "Refuser",
            text: "Êtes-vous vraiment sûr?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Refuser",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/cancel',
                    method: 'post',
                    data: {
                        iddemande: iddemande,
                        idmateriel: idmateriel
                    },
                    dataType: 'JSON',
                    success: function (res) {
                        Swal.fire({
                            title:"Info",
                            text: "Demande refusé.",
                            icon: "info",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    },
                    error: function (e) {
                        console.log(e);
                    }
                })
            }
        });
    });

    $ondelete = $(".table tbody td button.delete");
    $ondelete.click(function () {
        let iddemande = $(this).attr('data-iddemand');
        let idmateriel = $(this).attr('data-idmateriel');

        Swal.fire({
            title: "Suppression",
            text: "Êtes-vous vraiment sûr?",
            icon: "warning",
            confirmButtonColor: "#DA2C1A",
            showCancelButton: true,
            confirmButtonText: "Supprimer",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/demande',
                    method: 'DELETE',
                    data: {
                        iddemande: iddemande,
                        idmateriel: idmateriel
                    },
                    dataType: 'JSON',
                    success: function (res) {
                        Swal.fire({
                            title:"Info",
                            text: "Demande supprimé.",
                            icon: "info",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    },
                    error: function (e) {
                        console.log(e);
                    }
                })
            }
        });
    });
}


