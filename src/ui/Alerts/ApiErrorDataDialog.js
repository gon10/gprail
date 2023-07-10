import Swal from "sweetalert2"

const ApiErrorDataDialog = (error) => {
  return Swal.fire({
    title: "Error",
    text: "There was a problem with your request: " + error,
    icon: "error",
    confirmButtonText: "OK",
    //confirmButtonColor: colours.primary.main,
    //cancelButtonText: "No",
    focusCancel: false,
    focusConfirm: true
  })
} 

export default ApiErrorDataDialog
