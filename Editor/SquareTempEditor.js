(function() {

    function isDescendant(parent, child) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    function getParentContainer(child) {
        var node = child.parentNode;
        while (node != null) {
            if (node.classList.contains('draggable')) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    function initScene()
    {
        //var elements = document.querySelectorAll('div[class^="col-"]'),
        var elements = document.querySelectorAll('div.box'),
        elementsLen = elements.length;

        for (var i = 0; i < elementsLen; i++) {
            elements[i].classList.add("draggable");
            elements[i].setAttribute('draggable', 'true');
        }

        var droppers = document.querySelectorAll('.container'),
        droppersLen = droppers.length;

        for (var i = 0; i < droppersLen; i++) {
            droppers[i].classList.add("dropper");
        }
    }

    var dndHandler = {

        draggedElement: null, // Propriété pointant vers l'élément en cours de déplacement
        coppyElement: null,

        applyDragEvents: function(element) {

            element.draggable = true;

            var dndHandler = this; // Cette variable est nécessaire pour que l'événement « dragstart » ci-dessous accède facilement au namespace « dndHandler »

            element.addEventListener('dragstart', function(e) {
                dndHandler.setTarget(e.target); // On sauvegarde l'élément en cours de déplacement
                e.dataTransfer.setData('text/plain', ''); // Nécessaire pour Firefox
            });

            element.addEventListener('dragover', function(e) {
                //e.preventDefault(); // On autorise le drop d'éléments
                dndHandler.setCoppy(e.target);
            });

            element.addEventListener('dragend', function(e) {
                e.target.classList.remove('dragging');
                dndHandler.coppyElement.remove();
            });
        },

        setTarget: function(target)
        {
            this.draggedElement = target;
            this.coppyElement = target.cloneNode(true);
            this.coppyElement.classList.remove('draggable');
            this.coppyElement.removeAttribute("draggable");
            this.coppyElement.classList.add('drag_copy');

            var dndHandler = this;
            setTimeout(function() {
                dndHandler.draggedElement.classList.add('dragging');}, 1);
            //alert('fzef');
        },

        setCoppy: function(targetChild)
        {
            var target = getParentContainer(targetChild);
            //alert(target);

            if(target != null)
            {
                if(target.previousSibling.className != "undefined" && target.previousSibling == this.coppyElement)
                    this.coppyElement.parentNode.insertBefore(target, this.coppyElement);
                else
                    target.parentNode.insertBefore(this.coppyElement, target);
            }
        },

        applyDropEvents: function(dropper) {
            var dndHandler = this;

            dropper.addEventListener('dragenter', function() {
                this.classList.add('drop_hover');
                if(!isDescendant(this, dndHandler.coppyElement))
                    this.appendChild(dndHandler.coppyElement);
            });

            dropper.addEventListener('dragover', function(e) {
                e.preventDefault(); // On autorise le drop d'éléments
            });

            dropper.addEventListener('dragleave', function() {
                this.classList.remove('drop_hover'); // On revient au style de base lorsque l'élément quitte la zone de drop
            });

             // Cette variable est nécessaire pour que l'événement « drop » ci-dessous accède facilement au namespace « dndHandler »

            dropper.addEventListener('drop', function(e) {

                var target = e.target,
                    draggedElement = dndHandler.draggedElement, // Récupération de l'élément concerné
                    clonedElement = draggedElement.cloneNode(true); // On créé immédiatement le clone de cet élément

                while (target.className.indexOf('dropper') == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
                    target = target.parentNode;
                }

                this.classList.remove('drop_hover'); // Application du style par défaut

                clonedElement = target.insertBefore(clonedElement, dndHandler.coppyElement); // Ajout de l'élément cloné à la zone de drop actuelle
                clonedElement.classList.remove('dragging');
                dndHandler.applyDragEvents(clonedElement); // Nouvelle application des événements qui ont été perdus lors du cloneNode()
                dndHandler.coppyElement.remove();

                draggedElement.parentNode.removeChild(draggedElement); // Suppression de l'élément d'origine

            });

        }

    };

    initScene();

    var elements = document.querySelectorAll('.draggable'),
        elementsLen = elements.length;

    for (var i = 0; i < elementsLen; i++) {
        dndHandler.applyDragEvents(elements[i]); // Application des paramètres nécessaires aux éléments déplaçables
    }

    var droppers = document.querySelectorAll('.dropper'),
        droppersLen = droppers.length;

    for (var i = 0; i < droppersLen; i++) {
        dndHandler.applyDropEvents(droppers[i]); // Application des événements nécessaires aux zones de drop
    }

})();