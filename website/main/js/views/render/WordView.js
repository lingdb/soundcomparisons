/***/
WordView = Backbone.View.extend({
  /**
    Method to make it possible to check what kind of PageView this Backbone.View is.
  */
  getKey: function(){return 'word';}
  /**
    Function to activate update methods, and run them the first time.
    This will be called by the Renderer.
  */
, activate: function(){}
  /**
    Overwrites the current model with the given one performing a deep merge.
  */
, setModel: function(m){
    this.model = $.extend(true, this.model, m);
  }
  /**
    FIXME add necessary callbacks.
  */
, updateWordHeadline: function(){
    var word     = App.wordCollection.getChoice()
      , spLang   = App.pageState.getSpLang()
      , headline = {name: word.getLongName() || word.getNameFor(spLang)};
    //Sanitize name:
    if(_.isArray(headline.name))
      headline.name = headline.name.join(', ');
    //MapsLink:
    if(!App.pageState.isPageView('map')){
      headline.mapsLink = {
        link: 'href="'+App.router.linkMapView({word: word})+'"'
      , ttip: App.translationStorage.translateStatic('tooltip_words_link_mapview')
      };
    }
    //Neighbours:
    var withN = function(w){
      return {
        link:  App.router.linkCurrent({word: w})
      , ttip:  w.getLongName()
      , trans: w.getNameFor(spLang)
      };
    };
    //Previous Word:
    headline.prev = $.extend(withN(word.getPrev())
    , {title: App.translationStorage.translateStatic('tabulator_word_prev')});
    //Next Word:
    headline.next = $.extend(withN(word.getNext())
    , {title: App.translationStorage.translateStatic('tabulator_word_next')});
    //Done:
    this.setModel({wordHeadline: headline});
  }
  /**
    FIXME add necessary callbacks.
  */
, updateWordTable: function(){
    //The word to use:
    var word = App.wordCollection.getChoice();
    //Calculating the maximum number of language cols:
    var maxLangCount = _.chain(App.regionCollection.models).map(function(r){
      var c = r.getLanguages().length;
      return (c > 6) ? 6 : c;
    }).max().value();
    //Do we color by family?
    var colorByFamily = App.study.getColorByFamily();
    //Building the table:
    var table = {
      wordHeadlinePlayAll: App.translationStorage.translateStatic('wordHeadline_playAll')
    , rows: []
    };
    //We iterate the tree families->regions->languages and construct rows from that.
    App.familyCollection.each(function(f){
      var family = {rowSpan: 0, name: f.getName()};
      if(colorByFamily) family.color = f.getColor();
      //Regions to deal with:
      var regions = [];
      f.getRegions().each(function(r){
        var region = {name: r.getShortName()}, languages = r.getLanguages();
        if(!colorByFamily) region.color = r.getColor();
        //Calculating the rowSpan for the current region:
        region.rowSpan  = _.max([Math.ceil(languages.length / 6), 1]);
        family.rowSpan += region.rowSpan;
        //Further handling of languages; lss :: [[LanguageCell]]
        var cellCount = maxLangCount, lss = [], ls = [];
        languages.each(function(l){
          //Swapping ls over to lss:
          if(cellCount === 0){
            lss.push(ls);
            ls = [];
            cellCount = maxLangCount;
          }
          //Generating a LanguageCell:
          var cell = {
            isLanguageCell: true
          , link: 'href="'+App.router.linkLanguageView({language: l})+'"'
          , shortName: l.getShortName()
          , longName:  l.getLongName()
          };
          var t = App.transcriptionMap.getTranscription(l, word);
          if(s = t.getAltSpelling()) cell.spelling = s;
          cell.phonetic = t.getPhonetic();
          //Filling ls:
          ls.push(cell);
          cellCount--;
        }, this);
        //Handling empty languageCells:
        for(;cellCount > 0; cellCount--){ls.push({isLanguageCell: true};)}
        lss.push(ls);
        //Filling regions from lss:
        _.each(lss, function(ls, i){
          if(i === 0) ls.unshift(region);
          regions.push(ls);
        }, this);
      }, this);
      //Adding to the rows:
      var row = {cells: []};
      if(parseInt(f.getId()) !== 0) row.spaceRow = true;
      _.each(regions, function(cells, i){
        if(i === 0) cells.unshift(family);
        row.cells = cells;
        table.rows.push(row);
        row = {cells: []};
      }, this);
    }, this);
    //Done:
    this.setModel(table);
  }
  /***/
, render: function(){
    console.log('WordView.render()');
    //FIXME implement
  }
});
