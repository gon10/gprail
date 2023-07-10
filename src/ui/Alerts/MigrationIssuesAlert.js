import Swal from "sweetalert2"

const MigrationIssuesAlert = (issues) => {
  return Swal.fire({
    title: "Migration Issues",
    text: issues,
    icon: "warning",
    showConfirmButton: true,
    // timer: 10000
  })
} 

export default MigrationIssuesAlert