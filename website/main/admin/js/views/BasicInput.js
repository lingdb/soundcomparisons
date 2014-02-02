/**
  model: ResultCollection
  el: Basic Input Area
*/
BasicInput = InputView.extend({
  initialize: function(){
    //Dealing with translationProviders:
    this.providers = window.Translation.translationProviders;
    this.providers.on('change', this.renderProviders, this);
    this.renderProviders();
    //Dealing with studies:
    this.studies = window.Translation.studies;
    this.studies.on('change', this.renderStudies, this);
    this.renderStudies();
    //Dealing with offsets:
    this.offsets = window.Translation.offsets;
    this.offsets.on('change', this.renderOffsets, this);
    //When to fetch results:
    this.offsets.on('change', this.fetchResults, this);
  }
, renderProviders: function(){
    var ps = this.providers.get('providerGroups')
      , cp = this.providers.get('selected')
      , target = this.$('#DynamicTranslations_SuffixList');
    //Cleaning up old entries:
    target.find('button').remove();
    //Building new entries:
    var t = this;
    _.each(ps, function(p){
      target.append(t.mkButton(p, p === cp));
      //Handling click events:
      target.find('button:last').click(function(e){
        e.preventDefault();
        t.providers.set({selected: p});
      });
    });
  }
, renderStudies: function(){
    var xs = this.studies.get('names')
      , cs = this.studies.get('selected')
      , target = this.$('#DynamicTranslations_StudyList');
    //Cleaning up old entries:
    target.find('button').remove();
    //Building new entries:
    var t = this;
    _.each(xs, function(s){
      target.append(t.mkButton(s, s === cs));
      //Handling click events:
      target.find('button:last').click(function(e){
        e.preventDefault();
        t.studies.set({selected: s});
      });
    });
  }
, renderOffsets: function(){
    var os = this.offsets.get('offsets')
      , co = this.offsets.get('selected')
      , target = this.$('#DynamicTranslations_PageList');
    //Cleaning up old entries:
    target.find('button').remove();
    //Building new entries:
    var t = this, i = 1;
    _.each(os, function(ps, o){
      target.append(t.mkButton(i, co === o));
      i++;
      //Handling click events:
      target.find('button:last').click(function(e){
        e.preventDefault();
        t.offsets.set({selected: o});
      });
    });
  }
, fetchResults: function(){
    var query = {
      action: 'page'
    , Providers: this.offsets.offsetProviders()
    , Study: this.studies.get('selected')
    , TranslationId: window.Translation.currentTranslation.get('TranslationId')
    , Offset: this.offsets.get('selected')
    };
    //Validation of query:
    if(query.Offset === null || query.Providers === null || !query.Study){
      console.log('Broken query: '+JSON.stringify(query));
      return;
    }
    query.Providers = JSON.stringify(query.Providers);
    //Fetching:
    var t = this;
    $.get(window.Translation.url, query).done(function(ds){
      ds = $.parseJSON(ds);
      var pCount = _.keys(ds).length;
      var rs = [];
      //One Result from each Group for every rotation:
      while(_.keys(ds).length > 0){
        _.map(_.keys(ds), function(k){
          rs.push(new Result(ds[k].shift()));
          if(ds[k].length === 0)
            delete ds[k];
        }, this);
      }
      t.model.setGroupSize(pCount).reset(rs);
    });
  }
// A helperfunction to build buttons:
, mkButton: function(text, selected){
    selected = (selected === true) ? ' disabled btn-inverse' : '';
    return '<button class="btn btn-small'+selected+'">'+text+'</button>';
  }
});
