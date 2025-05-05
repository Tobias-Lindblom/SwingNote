const Note = require('../models/Note');

// Hämtar alla anteckningar som tillhör den inloggade användaren
exports.getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id })
    .populate('sharedWith', 'name email'); // Fyll i information om användare som anteckningen är delad med
  res.status(200).json(notes);
};

// Skapar en ny anteckning med valfria fält som färg, taggar och delning
exports.createNote = async (req, res) => {
  try {
    const { title, content, color, tags, sharedWith } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: 'Titel och innehåll krävs' });

    const noteData = {
      title,
      content,
      user: req.user.id,
    };
    
    // Lägg till valfria fält om det finns med i begäran
    if (color) noteData.color = color;
    if (tags && Array.isArray(tags)) noteData.tags = tags;
    
    // Om anteckningen ska delas, lägg till delningsdata
    if (sharedWith && Array.isArray(sharedWith) && sharedWith.length > 0) {
      noteData.sharedWith = sharedWith;
      noteData.isShared = true;
    }

    const note = await Note.create(noteData);

    res.status(201).json(note);
  } catch (err) {

    console.error("Fel vid skapande av anteckning:", {
      message: err.message,
      stack: err.stack,
      data: req.body
    });
    
    res.status(500).json({ 
      message: 'Serverfel vid skapande av anteckning', 
      error: err.message 
    });
  }
};

// Uppdatera en anteckning om användaren äger den
exports.updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Anteckning hittades inte' });

  // Säkerställ att den inloggade användaren äger anteckningen
  if (note.user.toString() !== req.user.id)
    return res.status(401).json({ message: 'Inte behörig' });

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedNote);
};

// Tar bort en anteckning om användaren äger den
exports.deleteNote = async (req, res) => {
    try {
      const note = await Note.findById(req.params.id);
      if (!note) return res.status(404).json({ message: 'Anteckningen hittades inte' });
  
      if (note.user.toString() !== req.user.id)
        return res.status(401).json({ message: 'Inte behörig' });
  
      await Note.findByIdAndDelete(req.params.id);
      
      res.status(200).json({ message: 'Antecknin borttagen', id: req.params.id });
    } catch (err) {
      console.error('Fel vid borttagning:', err);
      res.status(500).send({ message: err.message });
    }
  };

// Sök bland användarens anteckningar baserat på titel, taggar eller färg
exports.searchNotes = async (req, res) => {
  try {
    const { q, tags, color } = req.query;
    

    const query = { user: req.user.id };
    
    // Fuzzy-sökning på titel
    if (q) {
      query.title = { $regex: q, $options: 'i' };
    }
    
    // Filtrera på taggar (komma-separerade)
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Filtrera på färg
    if (color) {
      query.color = color;
    }
    
    const notes = await Note.find(query);
    res.status(200).json(notes);
  } catch (error) {
    console.error('Fel vid sökning:', error);
    res.status(500).json({ message: 'Serverfel' });
  }
};

// Dela en anteckning med en annan användare (om de är vänner)
  exports.shareNote = async (req, res) => {
    try {
      const { userId } = req.body;
      const note = await Note.findById(req.params.id);
      
      if (!note) return res.status(404).json({ message: 'Anteckning hittades inte' });
      
      // Kontrollera att den inloggade äger anteckningen
      if (note.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'inte behörig att dela denna anteckning' });
      }
      
// Kontrollera att användaren är en vän
const isFriend = req.user.friends.includes(userId);
if (!isFriend) {
  return res.status(403).json({ message: 'Du kan bara dela med vänner' });
}
      
      // Lägg till i delning om inte redan tillagd
      if (!note.sharedWith || !note.sharedWith.includes(userId)) {
        if (!note.sharedWith) note.sharedWith = [];
        note.sharedWith.push(userId);
        note.isShared = true;
        await note.save();
      }
      
      res.json({ message: 'Anteckning delad', note });
    } catch (error) {
      console.error('Fel vid delning:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
// Tar bort en delning av anteckning från en specifik användare
  exports.removeSharing = async (req, res) => {
    try {
      const note = await Note.findById(req.params.id);
      
      if (!note) return res.status(404).json({ message: 'Anteckning hittades inte' });
      
      // Säkerställ att ägaren gör ändringen
      if (note.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Inte behörig att ändra delning' });
      }
      
      // Ta bort användaren från delningslistan
      if (note.sharedWith && note.sharedWith.length > 0) {
        note.sharedWith = note.sharedWith.filter(
          id => id.toString() !== req.params.userId
        );
        
        // Om inga fler delningar kvar, uppdatera flagga
        if (note.sharedWith.length === 0) {
          note.isShared = false;
        }
        
        await note.save();
      }
      
      res.json({ message: 'Delning borttagen', note });
    } catch (error) {
      console.error('Fel vid borttagning av delning:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
// Hämtar alla anteckningar som är delade med en inloggade användaren
  exports.getSharedNotes = async (req, res) => {
    try {
      const sharedNotes = await Note.find({
        sharedWith: req.user.id
      }).populate('user', 'name email'); // Visa vem som äger anteckningen
      
      res.json(sharedNotes);
    } catch (error) {
      console.error('Fel vid hämtnin av delade anteckningar :', error);
      res.status(500).json({ message: error.message });
    }
  };