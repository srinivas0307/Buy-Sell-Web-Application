<script>
  document.addEventListener('DOMContentLoaded', function () {
    var signupButton = document.querySelector('.signup button');
    var signupSound = document.getElementById('signupSound');

    signupButton.addEventListener('click', function () {
      signupSound.play();
    });
  });
</script>
