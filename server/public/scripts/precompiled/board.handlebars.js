(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['board'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "	<div class=\"column\">\n		<div class=\"category\">"
    + container.escapeExpression(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "</div>\n"
    + ((stack1 = helpers.each.call(alias1,depth0,{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</div>\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "		<div class=\"clue\" data-category=\""
    + alias1(container.lambda((container.data(data, 1) && container.data(data, 1).key), depth0))
    + "\" data-index=\""
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n			<span>\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.dailyDouble : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.program(5, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "			</span>\n		</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "					\"DD\"\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "				$"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.game : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
})();