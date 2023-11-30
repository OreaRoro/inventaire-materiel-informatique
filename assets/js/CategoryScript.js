function add_category(){
    save_method = "add";
    $("#form")[0].reset(); // reset form on modals
    $(".modal").modal("show"); // show bootstrap modal
    $(".modal-title").text("Formulaire d'ajout d'une catégorie"); // Set Title to Bootstrap modal title
}

function edit(id) {
    save_method = "update";
    $("#form")[0].reset(); // reset form on modals
    //Ajax Load data from ajax
    $.ajax({
        url: "/api/category?id=" + id,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            $('[name="id"]').val(data._id);
            $('[name="title"]').val(data.title);
            $(".modal").modal("show"); // show bootstrap modal when complete loaded
            $(".modal-title").text("Edition du catégorie: " + data.title); // Set title to Bootstrap modal title
        },
        error: function (err) {
            console.log(err);
            //alert('Error get data from ajax');
        },
    });
}


function save() {
    let btn = $('#btnSave');
    btn.text('Enregistrement...'); //change button text
    btn.attr('disabled', true); //set button disable
    let url, type;

    if (save_method === 'add') {
        type = 'post'
    } else {
        type = 'put'
    }
    //data = new FormData($('#form')[0]);
    let id =  $('[name="id"]').val();
    let category = $('[name="title"]').val();
    const form = document.querySelector('form');
    if(!category) {
        Swal.fire({
            title:"Formulaire vide",
            text: "Veuillez remplir le formulaire",
            icon: "info",
            confirmButtonText: "OK",
        }).then((result) => {
            if (result.isConfirmed) {
                //location.reload();
                btn.text('Enregistrer'); //change button text
                btn.attr('disabled', false); //set button not disable
            }
        });
    } else {
        $.ajax({
            url: "/api/category?id=" + id,
            type: "GET",
            dataType: "JSON",
            success: function (data) {
                let id =  $('[name="id"]').val();
                let category = $('[name="title"]').val();
                if (category === data.title) {
                    Swal.fire({
                        title:"info",
                        text: "Aucune modification",
                        icon: "info",
                        confirmButtonText: "OK",
                    });
                    btn.text('Enregistrer'); //change button text
                    btn.attr('disabled', false); //set button not disable
                } else {
                    $.ajax({
                        url: '/api/category',
                        method: type,
                        data: {
                            id: id,
                            title: category
                        },
                        dataType: "JSON",
                        success: function (res) {
                            let btn = $('#btnSave')
                            let text = '';
                            if(save_method === 'add'){
                                text = "Catégorie Enregistré avec succès"
                            }
                            if(save_method === 'update'){
                                text = "Catégorie modifier avec succès"
                            }
                            if (res) {
                                //if success close modal and reload ajax table
                                Swal.fire({
                                    title: "succès",
                                    text: text,
                                    icon: "success",
                                    confirmButtonText: "OK",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        $(".modal").modal("hide");
                                        location.reload();
                                    }
                                });
                            } else {
                                Swal.fire({
                                    title: "Echec lors de l'enregistrement",
                                    text: "Veuillez remplir le formulaire.",
                                    icon: "warning",
                                });
                            }
                            btn.text("Enregistrer"); //change button text
                            btn.attr("disabled", false); //set button enable
                        },
                        error: function (err) {
                            if (err.responseJSON.error.title) {
                                Swal.fire({
                                    title: 'info',
                                    text: err.responseJSON.error.title,
                                    icon: "info",
                                    confirmButtonText: "OK"
                                });
                            }
                            btn.text("Enregistrer"); //change button text
                            btn.attr("disabled", false); //set button enable
                            console.log(err);
                        },
                    });
                }
            },
            error: function (err) {
                console.log(err);
                //alert('Error get data from ajax');
            },
        });

    }

}

function supprimer(id) {
    $.ajax({
        url: "/api/category?id=" + id,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            let id = data._id;
            let category = data.title;
            Swal.fire({
                title: "Êtes-vous sûr de supprimer",
                text: "La catégorie " + data.title,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DA2C1A",
                confirmButtonText: "Supprimer",
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: "/api/categorydelete",
                        type: "POST",
                        data: {
                            id: id,
                            title: category
                        },
                        dataType: "JSON",
                        success: function (data) {
                            Swal.fire({
                                title:'la catégorie ' + category + " a été supprimé avec succès!",
                                icon: "success",
                                confirmButtonText: "OK",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.reload();
                                }
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                            alert("Error deleting data");
                        },
                    });
                }
            });
        },
        error: function (err) {
            console.log(err.message);
        },
    });
}

// Delete Category
if (window.location.pathname === '/category') {
    $ondelete = $(".table tbody td button.delete");
    $ondelete.click(function() {
        let id = $(this).attr("data-id");
        $.ajax({
            url: '/api/confirm-delete-category',
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
                                    url: '/api/category',
                                    method: 'DELETE',
                                    data: {id: id},
                                    dataType: 'JSON',
                                    success: function (res) {
                                        swal.fire({
                                            title: 'succès',
                                            text: `La catégorie ${res.title} à été supprimé avec succès`,
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
                        text: 'Cette catégorie ne doit pas être supprimé car elle est associée à un(e) ou plusieurs Matériels.',
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