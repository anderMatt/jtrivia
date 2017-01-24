(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['report'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"report\">\n	<div>Game Over</div>\n	<div>\n		<span> Percent Correct: </span><span>"
    + alias4(((helper = (helper = helpers.percentCorrect || (depth0 != null ? depth0.percentCorrect : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"percentCorrect","hash":{},"data":data}) : helper)))
    + " %</span>\n	</div>\n	<div>\n		<span> Largest Wager: </span><span class=\"dollar\">"
    + alias4(((helper = (helper = helpers.largestWager || (depth0 != null ? depth0.largestWager : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"largestWager","hash":{},"data":data}) : helper)))
    + " </span>\n	</div>\n</div>\n\n";
},"useData":true});
})();