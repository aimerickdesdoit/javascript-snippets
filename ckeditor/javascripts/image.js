CKEDITOR.on('dialogDefinition', function( ev ){
  var dialogName = ev.data.name;
  var dialogDefinition = ev.data.definition;
  
  if(dialogName == 'image'){
    dialogDefinition.removeContents('Link');
    dialogDefinition.removeContents('advanced');
    
    var internalImages = ev.editor.config.internalImages;
    if(!internalImages){
      return;
    }
    
    var infoTab = dialogDefinition.getContents('info');
    
    var originalMinHeight = dialogDefinition.minHeight
    dialogDefinition.minHeight = 150;
    
    dialogDefinition.onShowAlias = dialogDefinition.onShow;
    dialogDefinition.onShow = function(){      
      this.onShowAlias = dialogDefinition.onShowAlias;
      this.onShowAlias();
      
      if(originalMinHeight){
        var position = this.getPosition();
        this.move(position.x, position.y + ((originalMinHeight - dialogDefinition.minHeight) / 2));
        originalMinHeight = null;
      }
      
      var txtWidth = this.getContentElement('info', 'txtWidth');
      var element = txtWidth.getElement();
      if(element){
        var i = 0;
        while(true){
          element = element.getParent();
          if(element.getName().toLowerCase() == 'tr'){
            i++;
          }
          if(i == 5){
            element.hide();
            break;
          }
        }
      }
      
      var url = this.getContentElement('info', 'txtUrl');
      var internalImage = this.getContentElement('info', 'internalImage');
      internalImage.setValue(url.getValue());
    };
    
    infoTab.add({
      type : 'vbox',
      id : 'internalImagesOptions',
      children : [{
        type : 'select',
        label : 'Liste des images',
        id : 'internalImage',
        items: internalImages,
        style : 'width: 100%;',
        onChange: function(ev){
          var dialog = CKEDITOR.dialog.getCurrent();
          var url = dialog.getContentElement('info', 'txtUrl');
          url.setValue(ev.data.value);
        }
      }]
    });
  }
});