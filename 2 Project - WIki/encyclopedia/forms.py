from django import forms

class CreateNewWiki(forms.Form):
    title = forms.CharField(label="Title", max_length=100, 
                    widget=forms.TextInput(attrs={'placeholder': 'Title', 'class':'form-control'}))
    # content = forms.Textarea(label="Content", attrs={'type': 'markdwo'}) 
    content = forms.CharField(widget=forms.Textarea(attrs={'class':'form-control',
                                                   'placeholder': 'Content in markdown format like this:\
\n\n#HTML\
\n\nHTML is a markup language that can be used to define the structure of a web page. HTML elements include \
\n* headings\
\n* paragraphs\
\n* lists\
\n* links\
\n* and more!'}))