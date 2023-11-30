// Add Employe
$('#employe_add').submit(function (e) {
    e.preventDefault();

    let unindexed_array = $(this).serializeArray();
    let data = {};
    $.map(unindexed_array, function(n, i) {
        data[n['name']] = n['value'];
    });



    let nameInput = $('#name');
    let lastnameInput = $('#lastname');
    let adresseInput = $('#adresse');
    let telephoneInput = $('#telephone');
    let fonctionSelect = $('#fonction');
    let fonctionval = fonctionSelect.val();

    if (data.name === '' && data.lastname === '' && data.adresse === '' && data.telephone === '' && fonctionval === null) {
        swal.fire({
            title: 'Formulaire vide',
            text: 'Veuillez remplir les formulaires s\'il vous plaît',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    } else if (data.name === '') {
        nameInput.addClass('is-invalid');
        $('#error_name').text('Ce champ est requis');
    } else if (data.lastname === '') {
        lastnameInput.addClass('is-invalid');
        $('#error_lastname').text('Ce champ est requis');
    } else if (data.adresse === '') {
        adresseInput.addClass('is-invalid');
        $('#error_adresse').text('Ce champ est requis');
    } else if (data.telephone === '') {
        telephoneInput.addClass('is-invalid');
        $('#error_telephone').text('Ce champ est requis');
    } else if (fonctionval === null) {
        fonctionSelect.addClass('is-invalid');
        $('#error_fonction').text('Ce champ est requis');
    }else {
        $.ajax({
            url: '/api/employe',
            method: 'POST',
            data: data,
            dataType: 'JSON',
            success: function (res) {
                swal.fire({
                    title: 'Succès',
                    text: 'Employé enregistré avec succès.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                    .then(res => {
                        if(res.isConfirmed) {
                            location.replace('/employe');
                        }
                    })
            },
            error: function (err) {
                console.log(err);
            }
        })
    }
});

// Update Employe
$('#employe_update').submit(function (e) {
    e.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};
    $.map(unindexed_array, function(n, i) {
        data[n['name']] = n['value'];
    });
    $.ajax({
        url: '/api/employe?id=' + data.id,
        method: 'GET',
        dataType: 'JSON',
        success: function (res) {

            let name = $('#name').val();
            let lastname = $('#lastname').val();
            let telephone = $('#telephone').val();
            let adresse = $('#adresse').val();
            let fonction = $('#fonction').val();
            if (name === res.name && lastname === res.lastname && adresse === res.adresse && telephone === res.telephone && fonction === res.fonction._id) {
                Swal.fire({
                    title: "info",
                    text: 'Auccun modification n\'a été éffectué.',
                    icon: "info",
                    confirmButtonText: "OK",
                });
            } else {
                $.ajax({
                    url: '/api/employe',
                    method: 'PUT',
                    data: data,
                    dataType: 'JSON',
                    success: function (res) {
                        if (res) {
                            Swal.fire({
                                title: "succès",
                                text: 'Employé modifié avec succès.',
                                icon: "success",
                                confirmButtonText: "OK",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.replace('/employe');
                                }
                            });
                        }
                    },
                    error: function (e) {
                       console.log(e);
                    }
                })
            }
        },
        error: function(e) {
            console.log(e.message);
        }
    });
});

// Delete Employe
if (window.location.pathname === '/employe') {
    $ondelete = $(".table tbody td button.delete");
    $ondelete.click(function() {
        let id = $(this).attr("data-id");
        Swal.fire({
            title: "Suppression",
            text: "Êtes-vous vraiment sûr?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DA2C1A",
            confirmButtonText: "Supprimer",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/employe',
                    method: 'DELETE',
                    data: {id: id},
                    dataType: 'JSON',
                    success: function (res) {
                        Swal.fire({
                            title: 'succès',
                            text: `Employe ${res.name} a été supprimé avec succès.`,
                            icon: "success",
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
    })
}

if (window.location.pathname === '/employe') {
    $ondelete = $(".table tbody td button.delete");
    $ondelete.click(function() {
        let id = $(this).attr("data-id");
        $.ajax({
            url: '/api/confirm-delete-employe',
            method: 'POST',
            data: {id: id},
            dataType: 'JSON',
            success: function (res) {
                if (res.message === '') {
                    swal.fire({
                        title: 'Suppression',
                        text: 'Êtes-vous vraiment sûr?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: "#DA2C1A",
                        confirmButtonText: "Supprimer",
                    })
                        .then(result => {
                            if (result.isConfirmed) {
                                $.ajax({
                                    url: '/api/employe',
                                    method: 'DELETE',
                                    data: {id: id},
                                    dataType: 'JSON',
                                    success: function (res) {
                                        swal.fire({
                                            title: 'succès',
                                            text: `L'employe ${res.name} à été supprimé avec succès`,
                                            icon: 'success',
                                            confirmButtonText: "Supprimer",
                                        })
                                            .then(result => {
                                                if (result.isConfirmed) {
                                                    location.reload();
                                                }
                                            })
                                    },
                                    error: function (e) {
                                        console.log(e);
                                    }
                                })

                            }
                        })

                } else {
                    swal.fire({
                        title: 'Info',
                        text: 'On ne peut pas encore supprimer cet employe car il/elle utilise encore notre matériel.',
                        icon: 'info',
                        confirmButtonText: 'OK'
                    })
                        .then(result => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        })
                }
            },
            error: function (e) {
                console.log(e);
            }
        })

    })
}