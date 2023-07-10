import Swal from "sweetalert2"

const SignOutSuccessDialog = () => {
  return Swal.fire({
    title: "Success",
    text: "You signed out successfully",
    icon: "success",
    showConfirmButton: false,
    timer: 1200
  })
} 

export default SignOutSuccessDialog
