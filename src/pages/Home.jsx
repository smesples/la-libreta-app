// Home.jsx Gasto
       </BotonGrande>
     </div>

     {/* Modales */}
     <ModalRegistro
       open={modalIngreso}
       onClose={() => setModalIngreso(false)}
       tipo="ingreso"
       onGuardar={(datos) => crearTransaccion.mutateAsync(datos)}
     />
     <ModalRegistro
       open={modalGasto}
       onClose={() => setModalGasto(false)}
       tipo="gasto"
       onGuardar={(datos) => crearTransaccion.mutateAsync(datos)}
     />
     <ModalProducto
       open={modalProducto}
       onClose={() => { setModalProducto(false); setProductoEditar(null); }}
       producto={productoEditar}
       onGuardar={(datos) => productoEditar
         ? actualizarProducto.mutateAsync({ id: productoEditar.id, data: datos })
         : crearProducto.mutateAsync(datos)
       }
     />
   </div>
 );
}
