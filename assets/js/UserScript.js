// Save User
$('#user_add').submit(function (e)  {
    e.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};
    $.map(unindexed_array, function(n, i) {
        data[n['name']] = n['value'];
    });
    if (data.name === '' && data.lastname === '' && data.email === '' && data.password === '') {
        Swal.fire({
            title: "Formulaire vide.",
            text: "Veuillez remplir les formulaires s'il vous plaît.",
            icon: "info",
        });
    } else if (data.name === '') {
        $('#name').addClass('is-invalid');
        $('#error_name').text('Ce champ est requis');
    } else if (data.lastname === '') {
        $('#lastname').addClass('is-invalid');
        $('#error_lastname').text('Ce champ est requis');
    } else if (data.email === '') {
        $('#email').addClass('is-invalid');
        $('#error_email').text('Ce champ est requis');
    } else if (data.password === '') {
        $('#password').addClass('is-invalid');
        $('#error_password').text('Ce champ est requis');
    } else {
        $.ajax({
            url: "/api/user",
            method: "POST",
            data: data,
            dataType: "JSON",
            success: function (res) {
                if (res) {
                    Swal.fire({
                        title: "succès",
                        text: 'Utilisateur enregistré avec succès',
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.replace('/user');
                        }
                    });
                }
            },
            error: function (e) {
                if (e.responseJSON.errors.password) {
                    $('#password').addClass('is-invalid');
                    $('#error_password').text(e.responseJSON.errors.password);
                }
                if (e.responseJSON.errors.email) {
                    $('#email').addClass('is-invalid');
                    $('#error_email').text(e.responseJSON.errors.email);
                }
            }
        })
    }
});

// Update User
$('#user_update').submit(function (e) {
    e.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};
    $.map(unindexed_array, function(n, i) {
        data[n['name']] = n['value'];
    });
    $.ajax({
        url: '/api/user?id=' + data.id,
        method: 'GET',
        dataType: 'JSON',
        success: function (res) {
            let name = $('#name').val();
            let lastname = $('#lastname').val();
            let email = $('#email').val();
            let role = $('#role').val();
            if (name === res.name && lastname === res.lastname && email === res.email && role === res.role) {
                Swal.fire({
                    title: "info",
                    text: 'Auccun modification n\'a été éffectué.',
                    icon: "info",
                    confirmButtonText: "OK",
                });
            } else {
                $.ajax({
                    url: '/api/user',
                    method: 'PUT',
                    data: data,
                    dataType: 'JSON',
                    success: function (res) {
                        if (res) {
                            Swal.fire({
                                title: "succès",
                                text: 'Utilisateur modifié avec succès.',
                                icon: "success",
                                confirmButtonText: "OK",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.replace('/user');
                                }
                            });
                        }
                    },
                    error: function (e) {
                        if (e.responseJSON.errors.email) {
                            Swal.fire({
                                title: 'info',
                                text: e.responseJSON.errors.email,
                                icon: "warning",
                                confirmButtonText: "OK",
                            });
                        }
                    }
                })
            }
        },
        error: function(e) {
            console.log(e.message);
        }
    });
});

// Delete User
if (window.location.pathname === '/user') {
    $ondelete = $(".table tbody td button.delete");
    $ondelete.click(function() {
        let id = $(this).attr("data-id");
        Swal.fire({
            title: "Êtes-vous vraiment sûr?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DA2C1A",
            confirmButtonText: "Supprimer",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/user',
                    method: 'DELETE',
                    data: {id: id},
                    dataType: 'JSON',
                    success: function (res) {
                        Swal.fire({
                            title:"Utilisateur supprimé avec succès.",
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
