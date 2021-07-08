$(document).ready(function() {   
    //url de la api
    let url = 'http://localhost:3000/api/cuestionarios/';
    let opcion = null;
    //campos de la api
    let id, fecha,usuario,descripcion;
    //MOSTRAR
    let tablaArticulos = $('#tablaArticulos').DataTable({            
        "ajax":{
            "url": url,
            "dataSrc":""
        },
        "columns":[
            {"data":"idcuestionario"},
            {"data":"fechaCreacion"},
            {"data":"usuarioCreador"},
            {"data":"descripcion"},
            {"defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>"}
        ],
                
    });
    
    //CREAR
    $("#btnCrear").click(function(){
        opcion='crear';            
        id=null;
        $("#formArticulos").trigger("reset");
        $(".modal-header").css( "background-color", "#23272b");
        $(".modal-header").css( "color", "white" );
        $(".modal-title").text("Crear Artículo");
        $('#modalCRUD').modal('show');	    
    });    
    //EDITAR        
    $(document).on("click", ".btnEditar", function(){		            
        opcion='editar';
        fila = $(this).closest("tr");	        
        id = parseInt(fila.find('td:eq(0)').text());
        fecha = fila.find('td:eq(1)').text();
        usuario = fila.find('td:eq(2)').text();
        descripcion = fila.find('td:eq(3)').text();            
        $("#id").val(id);
        $("#fecha").val(fecha);
        $("#usuario").val(usuario);
        $("#descripcion").val(descripcion);            
        $(".modal-header").css("background-color", "#7303c0");
        $(".modal-header").css("color", "white" );
        $(".modal-title").text("Editar Artículo");		
        $('#modalCRUD').modal('show');		   
    });

     //BORRAR
    $(document).on("click", ".btnBorrar", function(){
        fila = $(this);           
        id = parseInt($(this).closest('tr').find('td:eq(0)').text());            
        Swal.fire({
            title: '¿Confirma eliminar el registro?',                
            showCancelButton: true,
            confirmButtonText: `Confirmar`,                
            }).then((result) => {               
            if (result.isConfirmed) {
                $.ajax({
                    url: url+id,
                    method: 'delete',                        
                    data:  {id:id},    
                    success: function() {
                        tablaArticulos.row(fila.parents('tr')).remove().draw();                  
                    }
                });
                Swal.fire('¡Registro Eliminado!', '', 'success')
            } 
            })
    });     
    //submit para el CREAR y EDITAR
    $('#formArticulos').submit(function(e){                                     
        e.preventDefault();
        id = $.trim($('#id').val());    
        fecha = $.trim($('#fecha').val());
        usuario = $.trim($('#usuario').val());    
        descripcion = $.trim($('#descripcion').val());                
        if(opcion=='crear'){                
            $.ajax({                    
                url: url,
                method: 'post',                                                         
                contentType: 'application/json',  
                data:  JSON.stringify({fecha:fecha, usuario:usuario, descripcion:descripcion}),                       
                success: function(data) {                       
                    tablaArticulos.ajax.reload(null, false);                        
                }
            });	
        }
        if(opcion=='editar'){
            console.log("EDITAR");
            $.ajax({                    
                url: url+id,
                method: 'put',                                        
                contentType: 'application/json',  
                data:  JSON.stringify({id:id, fecha:fecha , usuario:usuario, descripcion:descripcion}),                       
                success: function(data) {                       
                    tablaArticulos.ajax.reload(null, false);                        
                }
            });	
        }        		        
        $('#modalCRUD').modal('hide');											     			
    });
});