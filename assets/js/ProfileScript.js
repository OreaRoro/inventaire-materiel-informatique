// Update Profile
$('#update_profile').submit(function (e) {
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
            let image = $('#img').val();
            if (name === res.name && lastname === res.lastname && email === res.email && !image) {
                Swal.fire({
                    title: "info",
                    text: "Auccun modification n'a été éffectué.",
                    icon: "info",
                    confirmButtonText: "OK",
                });
            } else {
                let form = document.querySelector('#update_profile');
                $.ajax({
                    url: '/api/profile',
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
                                text: "Informations modifié avec succès.",
                                icon: "success",
                                confirmButtonText: "OK",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.reload();
                                }
                            });
                        }
                    },
                    error: function (e) {
                        if (e.responseJSON.error.email) {
                            Swal.fire({
                                title: 'info',
                                text: e.responseJSON.error.email,
                                icon: "info",
                                confirmButtonText: "OK",
                            })
                        }
                    }
                });
            }
        },
        error: function(e) {
            console.log(e.message);
        }
    })
});

// Update Password
$('#update_password').submit(function (e) {
    e.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};
    $.map(unindexed_array, function(n, i) {
        data[n['name']] = n['value'];
    });

    let id = data.id;
    let inputPassword = $('#Userpassword');
    let inputPasswordConfirm = $('#passwordConfirm');
    let password = inputPassword.val();
    let passwordconfirm = inputPasswordConfirm.val();

    if (password === '' && passwordconfirm === '') {
        inputPassword.addClass('is-invalid');
        $('#error_password').text('Ce champ est requis');
        inputPasswordConfirm.addClass('is-invalid');
        $('#error_passwordConfirm').text('Ce champ est requis');
    } else if (password !== passwordconfirm) {
        Swal.fire({
            title: "info",
            text: 'Veuillez confirmer votre mot de passe.',
            icon: "info",
            confirmButtonText: "OK",
        })
    } else if (password.length < 6) {
        inputPassword.addClass('is-invalid');
        $('#error_password').text('le mot de passe doit au moins contenir 6 caractères.');
    } else {
        $.ajax({
            url: '/api/profile',
            method: 'PUT',
            data: {
                id: id,
                password: password
            },
            dataType: 'JSON',
            success: function (res) {
                if (res) {
                    Swal.fire({
                        title: "succès",
                        text: 'Mot de passe modifié avec succès.',
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
            },
            error: function (e) {
                console.log(e)
            }
        });
    }
    console.log(id);
});