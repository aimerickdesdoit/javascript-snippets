CKEDITOR.on('dialogDefinition', function( ev ){
  var dialogName = ev.data.name;
  var dialogDefinition = ev.data.definition;
  
  if(dialogName == 'link'){
    // dialogDefinition.removeContents('target');
    dialogDefinition.removeContents('advanced');
    
    var internalLinks = ev.editor.config.internalLinks;
    if(!internalLinks || internalLinks.length == 0){
      return;
    }
    
    var label = ev.editor.config.internalLinksLabel || 'Liste des URLs internes';
    
    var infoTab = dialogDefinition.getContents( 'info' );
    var linkType = infoTab.get('linkType');

    linkType.onChangeAlias = linkType.onChange;
    linkType.onChange = function(){
      this.onChangeAlias();
    
      var dialog = this.getDialog(),
        typeValue = this.getValue();
    
      var element = dialog.getContentElement('info', 'internalLinksOptions');
      if(element){
        element = element.getElement().getParent().getParent();
        if(typeValue == 'url'){
          element.show();
        }
        else{
          element.hide();
        }
      }
    };
    
    dialogDefinition.onShowAlias = dialogDefinition.onShow;
    dialogDefinition.onShow = function(){
      this.onShowAlias = dialogDefinition.onShowAlias;
      this.onShowAlias();
      
      var protocol = this.getContentElement('info', 'protocol');
      var url = this.getContentElement('info', 'url');
      var internalLink = this.getContentElement('info', 'internalLink');
      
      var value = url.getValue();
      if(value){
        value = protocol.getValue() + value;
        var items = internalLink.items;
        for(var i = 0 ; i < items.length; i++){
          if(items[i][1] == value){
            internalLink.setValue(value);
          }
        }
      }
    };
      
    infoTab.add({
      type : 'vbox',
      id : 'internalLinksOptions',
      children : [{
        type : 'select',
        label : label,
        id : 'internalLink',
        items: internalLinks,
        style : 'width: 100%;',
        onChange: function(ev){
          var dialog = CKEDITOR.dialog.getCurrent();
          
          var protocol = dialog.getContentElement('info', 'protocol');
          protocol.setValue('');
          
          var url = dialog.getContentElement('info', 'url');
          url.setValue(ev.data.value);          
        }
      }]
    });
  }
});