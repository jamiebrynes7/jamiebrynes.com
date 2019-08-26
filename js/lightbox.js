document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByClassName("modal-toggle")).forEach(function(element) {
        element.onclick = function() {
            var modal = element.nextElementSibling;
            modal.classList.add("is-active");
        }
      });

    Array.from(document.getElementsByClassName("modal-close")).forEach((element) => {
        element.onclick = function() {
            var modal = element.parentElement;
            modal.classList.remove("is-active");
        }
    });

    Array.from(document.getElementsByClassName("modal-background")).forEach((element) => {
        element.onclick = function() {
            var modal = element.parentElement;
            modal.classList.remove("is-active");
        }
    });
})
