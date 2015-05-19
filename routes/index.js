/*
 * GET home page.
 */

/*exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};*/
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf8">
		<%- partial('partials/stylesheet', stylesheets) %>
<title><%= title %></title>
</head>
<body>
<h1><%= header %></h1>
<%- body %>
</body>
</html>