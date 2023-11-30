// Add Matériel
$('#materiel_add').submit(function (e) {
    e.preventDefault();

    let unindexed_array = $(this).serializeArray();
    let data = {};
    $.map(unindexed_array, function(n, i) {
        data[n['name']] = n['value'];
    });

    let designationInput = $('#designation');
    let serieInput = $('#serie');
    let statusSelect = $('#status');
    let status = statusSelect.val();
    let categorySelect = $('#category');
    let category = categorySelect.val();
    let image = $('#img').val();

    if (data.designation === '' && data.serie === '' && category === null && status === '' && !image) {
        swal.fire({
            title: 'Formulaire vide',
            text: 'Veuillez remplir les formulaires s\'il vous plaît',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    } else if (data.designation === '') {
        designationInput.addClass('is-invalid');
        $('#error_designation').text('Ce champ est requis');
    } else if (data.serie === '') {
        serieInput.addClass('is-invalid');
        $('#error_serie').text('Ce champ est requis');
    }else if (status === null) {
        statusSelect.addClass('is-invalid');
        $('#error_status').text('Ce champ est requis');
    } else if (category === null) {
        categorySelect.addClass('is-invalid');
        $('#error_category').text('Ce champ est requis');
    }else {
        let form = document.querySelector('#materiel_add');
        $.ajax({
            url: '/api/materiel',
            method: 'POST',
            enctype: 'multipart/form-data',
            processData: false, // Important!
            contentType: false,
            cache: false,
            data: new FormData(form),
            dataType: 'JSON',
            success: function (res) {
                if (res) {
                    Swal.fire({
                        title: "succès",
                        text: "Matériel enregistré avec succès.",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.replace('/materiel');
                        }
                    });
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
    }
});

// Update Matériel
$('#materiel_update').submit(function (e) {
    e.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};
    $.map(unindexed_array, function(n, i) {
        data[n['name']] = n['value'];
    });
    $.ajax({
        url: '/api/materiel?id=' + data.id,
        method: 'GET',
        dataType: 'JSON',
        success: function (res) {
            let designation = $('#designation').val();
            let serie = $('#serie').val();
            let image = $('#img').val();
            let status = $('#status').val();
            let category = $('#category').val();
            if (designation === res.designation && serie === res.serie && status === res.status && category === res.category._id && !image) {
                Swal.fire({
                    title: "info",
                    text: "Aucun modification n'a été éffectué.",
                    icon: "info",
                    confirmButtonText: "OK",
                });
            } else {
                let form = document.querySelector('#materiel_update');
                $.ajax({
                    url: '/api/materiel',
                    method: 'PUT',
                    enctype: 'multipart/form-data',
                    processData: false, // Important!
                    contentType: false,
                    cache: false,
                    data: new FormData(form),
                    dataType: 'JSON',
                    success: function (res) {
                        if (res) {
                            Swal.fire({
                                title: "succès",
                                text: "Matériel modifié avec succès.",
                                icon: "success",
                                confirmButtonText: "OK",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.replace('/materiel');
                                }
                            });
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
        },
        error: function(e) {
            console.log(e.message);
        }
    })
});

// Delete Matériel
if (window.location.pathname === '/materiel') {
    $ondelete = $(".table tbody td button.delete");
    $ondelete.click(function() {
        let id = $(this).attr("data-id");
        $.ajax({
            url: '/api/confirm-delete-materiel',
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
                                    url: '/api/materiel',
                                    method: 'DELETE',
                                    data: {id: id},
                                    dataType: 'JSON',
                                    success: function (res) {
                                        swal.fire({
                                            title: 'succès',
                                            text: `Le matériel ${res.designation} à été supprimé avec succès`,
                                            icon: 'success',
                                            confirmButtonText: "Supprimer",
                                        })
                                            .then(result => {
                                                if (result.isConfirmed) {
                                                    location.replace('/materiel');
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
                        text: 'Ce matériel ne doit pas être supprimé car il est en cours d\'utilisation.',
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

    });

}

if (window.location.pathname === '/materiel/use') {

    $onreturn = $(".table tbody td button.return");
    $onreturn.click(function () {
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
                action: "Retourné"
            },
            success: function (response) {
                console.log(response);
            },
            error: function (e) {
                console.log(e);
            }
        })

        Swal.fire({
            title: "Retour",
            text: "Êtes-vous vraiment sûr?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Retour",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/return',
                    method: 'post',
                    data: {
                        iddemande: iddemande,
                        idmateriel: idmateriel
                    },
                    dataType: 'JSON',
                    success: function (res) {
                        Swal.fire({
                            title:"Info",
                            text: "Materiel arrivé.",
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