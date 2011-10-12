/**
 * @todo
 *    quand la valeur est vide, aucune alerte ne se porduit alors qu'avec le type URL c'est le cas
 */

CKEDITOR.on('dialogDefinition', function( ev ){
  var dialogName = ev.data.name;
  var dialogDefinition = ev.data.definition;

  if(dialogName == 'link'){
    // dialogDefinition.removeContents('target');
    dialogDefinition.removeContents('advanced');
    
    var internalLinks = ev.editor.config.internalLinks;
    if(!internalLinks){
      return;
    }
    
    var label = ev.editor.config.internalLinksLabel || 'URL interne';
    
    var infoTab = dialogDefinition.getContents( 'info' );
    var linkType = infoTab.get('linkType');
    
    linkType.items.unshift([label, 'internalLink']);
    linkType['default'] = 'internalLink';
    
    dialogDefinition.onOkAlias = dialogDefinition.onOk;
    dialogDefinition.onOk = function(){
      var protocol = this.getContentElement('info', 'protocol');
      var url = this.getContentElement('info', 'url');
      var linkType = this.getContentElement('info', 'linkType');
      var internalLink = this.getContentElement('info', 'internalLink');
      
      if(linkType.getValue() == 'internalLink'){
        protocol.setValue('');
        url.setValue(internalLink.getValue());
        linkType.setValue('url').onChange();
      }
      
      this.onOkAlias = dialogDefinition.onOkAlias;
      return this.onOkAlias();
    };
    
    linkType.onChangeAlias = linkType.onChange;
    linkType.onChange = function(){
      this.onChangeAlias();
      
      var dialog = this.getDialog(),
        typeValue = this.getValue();
      
      var element = dialog.getContentElement('info', 'internalLinksOptions');
      if(element){
        element = element.getElement().getParent().getParent();
        if(typeValue == 'internalLink'){
          element.show();
          dialog.showPage('target');
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
      var linkType = this.getContentElement('info', 'linkType');
      var internalLink = this.getContentElement('info', 'internalLink');
    
      var value = url.getValue();
      if(value){
        value = protocol.getValue() + value;
        var items = internalLink.items;
        for(var i = 0 ; i < items.length; i++){
          if(items[i][1] == value){
            internalLink.setValue(value);
            linkType.setValue('internalLink').onChange();
          }
        }
      }
    };
    
    infoTab.add({
      type : 'vbox',
      id : 'internalLinksOptions',
      children : [{
        type : 'select',
        label : 'Liste des URLs internes',
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