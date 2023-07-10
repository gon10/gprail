import Swal from "sweetalert2"

const SignInSuccessDialog = () => {
  return Swal.fire({
    title: "Signed in successfully",
    text: "You are in",
    icon: "success",
    showConfirmButton: false,
    timer: 2000
  })
} 

export default SignInSuccessDialog
