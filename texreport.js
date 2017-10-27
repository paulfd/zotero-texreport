{
	"translatorID": "25f4c6e2-d790-4daa-a897-797619c7e2f2",
	"label": "TeXreport",
	"creator": "Paul Ferrand",
	"target": "tex",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"displayOptions": {
		"exportCharset": "UTF-8xBOM",
		"exportNotes": false
	},
	"inRepository": true,
	"translatorType": 2,
	"browserSupport": "g",
	"lastUpdated": "2017-10-26 08:45:20"
}

/*
    ***** BEGIN LICENSE BLOCK *****

    Copyright © 2014 Paul Ferrand

    ***** END LICENSE BLOCK *****
*/

var latex_header = `\\documentclass[paper=a4,fontsize=8pt,twocolumn]{scrartcl}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[a4paper,left=1.5cm,right=1.5cm,top=1.5cm,bottom=1.5cm]{geometry}
\\setlength\\parindent{0pt}
\\usepackage{textcomp}
\\usepackage{times}
\\usepackage[greek,english,french]{babel}
\\def\\coldblrule{\\vspace{6pt} \\hrule width \\hsize \\kern 1mm \\hrule width \\hsize height 2pt \\vspace{6pt}}
\\def\\colrule{\\vspace{6pt}\\hrule\\vspace{6pt}}
\\usepackage{hyperref}
\\begin{document}\r\n`

var latex_footer =`\\end{document}`

var re_p = new RegExp('<p>([^]*?)</p>', 'g');
var re_emph = new RegExp('<em>([^]*?)</em>', 'g');
var re_strong = new RegExp('<strong>([^]*?)</strong>', 'g');
var re_quotes = new RegExp('\"([^]*?)\"', 'g');

function doExport() {
	exportNotes = Zotero.getOption("exportNotes");
	// Until we fix UTF-8xBOM export, we'll write the BOM manually
	Zotero.write(latex_header);
	var item, line;
	while (item = Zotero.nextItem()) {
		Zotero.debug(item);
		if (item.itemType == 'book') {
			Zotero.write('\\emph{\\textbf{' + item.title + '}}.\\newline\r\n' + item.publisher);
			if (item.date) {
				Zotero.write(', ' + item.date);
			}
		}
		if (item.itemType == 'journalArticle') {
			Zotero.write('\\textbf{\`\`' + item.title + '\'\'}.\\newline\r\n' + '\\emph{' + item.publicationTitle + '}');
			if (item.date) {
				Zotero.write(', ' + item.date);
			}
		}
		if (item.itemType == 'conferencePaper') {
			Zotero.write('\\textbf{\`\`' + item.title + '\'\'}.\\newline\r\n' + 'in \\emph{' + item.conferenceName + '}');
			if (item.date) {
				Zotero.write(', ' + item.date);
			}
		}
		Zotero.write('.\\newline\r\n');
		for (var i=0; i < item.creators.length; i++) {
			if (item.creators[i].firstName){
				Zotero.write(item.creators[i].firstName[0] + '. ');
				Zotero.write(item.creators[i].lastName);
			}
			else{
				Zotero.write(item.creators[i].name);
			}
			if (i < item.creators.length - 2) {
				Zotero.write(', ');
			} else if (i == item.creators.length - 2) {
				Zotero.write(' and ');
			}
		}
		if (item.DOI) {
			Zotero.write('.\\newline\r\n');
			Zotero.write('DOI:\\href{http:\/\/dx.doi.org\/' + item.DOI +'}{' + item.DOI + '}');
			// Zotero.write('\\newline\r\n');
		}
		if (item.abstractNote){
			Zotero.write('\\colrule\r\n');
			Zotero.write('\\textbf{Abstract: ' + item.abstractNote + '}\r\n');
		}
		if (exportNotes){
			for (var i=0; i < item.notes.length; i++) {
				Zotero.write('\\colrule\r\n');
				// while ((re_tab = re_p.exec(item.notes[i].note)) !== null) {
				//   	// Zotero.debug('Found: ' + re_tab[0] + '(' + re_tab[1] + ')');
				// 	Zotero.write(re_tab[1] + '\r\n');
				// }
				str = item.notes[i].note;
				// No <p>...</p>
				str = str.replace(re_p, '$1\\newline');
				str = str.replace(re_quotes, '\`\`$1\'\'');
				str = str.replace(re_strong, '\\textbf{$1}');
				str = str.replace(re_emph, '\\emph{$1}');
				Zotero.write(str);
				// Zotero.write('\r\n')
			}
		}
		Zotero.write('\\coldblrule\r\n');

	}
	Zotero.write(latex_footer);
}