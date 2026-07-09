require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    // Netlify URL — update this after deploying frontend
    process.env.CLIENT_URL || '*'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/songs',    require('./routes/songs'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/media',    require('./routes/media'));

app.get('/', (req, res) => res.json({ message: 'Kale Hiwot Bama Choir API running.' }));

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedData();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Auto-seed admin + sample song on first run
async function seedData() {
  const Admin = require('./models/Admin');
  const Song  = require('./models/Song');
  const Message = require('./models/Message');

  // Seed/update admin - always sync password from env
  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Bama1234', 10);
  await Admin.findOneAndUpdate(
    { username: 'admin' },
    { username: 'admin', password: hashed },
    { upsert: true, new: true }
  );
  console.log('Admin user synced — username: admin');

  // Seed sample song
  const songExists = await Song.findOne({ title: 'እረኛዬ' });
  if (!songExists) {
    await Song.create({
      title: 'እረኛዬ',
      titleAmharic: 'እረኛዬ',
      singer: 'ዘማሪት ቤተልሔም ወልዴ',
      category: 'Worship',
      language: 'Amharic',
      songNumber: 1,
      lyrics: `እረኛዬ አንተ የኔ እረኛ
የነፍሴ ጠባቂ አንተ የማትተኛ
እኮራለሁ ባንተ እመካለሁ
በምንም አልፈራም በምንም አልሰጋም

የነፍሴ ንጉስ ኢየሱስ
አንተ ለኔ እረኛዬ ነህ
ነፍሴን ከአዳኝ ወጥመድ
ዘወትር ትጠብቀኛለህ

አንተ የኔ እረኛ
አትተኛም አታንቀላፋም
በሰላም ውዬ አድራለሁ
እኔ በምንም አልሰጋም

እረኛዬ አንተ የኔ እረኛ
የነፍሴ ጠባቂ አንተ የማትተኛ
እኮራለሁ ባንተ እመካለሁ
በምንም አልፈራም በምንም አልሰጋም

ካንተ ሌላ ወዳጅ
ካንተ ሌላ እረኛ
ለኔስ ምንም የለኝ
አንተ የማትተኛ

መልካም እረኛ ኢየሱስ
ስለኔ ነፍሱን ሰጥቶኛል
ሰላሙ ልቤን ሞልቶ
በድል ያራምደኛል

እረኛዬ አንተ የኔ እረኛ
የነፍሴ ጠባቂ አንተ የማትተኛ
እኮራለሁ ባንተ እመካለሁ
በምንም አልፈራም በምንም አልሰጋም

በለመለመ መስክ ዘወትር ያሳድረኛል
በእረፍት ውሀ ዘንድ ጌታ እኔን ይመራኛል
ቸርነት ምህረቱ እየተከተሉኝ
ከክፉ ይጠብቁኛል በድል ያራምዱኛል

እረኛዬ አንተ የኔ እረኛ
የነፍሴ ጠባቂ አንተ የማትተኛ
እኮራለሁ ባንተ እመካለሁ
በምንም አልፈራም በምንም አልሰጋም

ምድር ብትነዋወጥ ብትነዋወጥ
ሁሉም ነገር ስፍራውን ቢለቅ
ከቶ እንዳልፈራ ከቶ እንዳልናወጥ
ልቤን ሞላኸው በሰላም በእረፍት

ያረጋጋኸኝ በነውጡ አለም
ጋሻዬ ነህና ለዘለአለም
እኔ ልበልህ እረድኤቴ ስለሆንክልኝ
አቅም ጉልበቴ`
    });
    console.log('Sample song "እረኛዬ" seeded');
  }

  // Seed welcome message
  const msgExists = await Message.findOne({ title: 'Welcome' });
  if (!msgExists) {
    await Message.create({
      title: 'ወደ ቃለ ሕይወት ባማ ዘማሪዎች እንኳን ደህና መጡ!',
      content: 'ይህ ድህረ ገጽ የቤተክርስቲያናችን የመዝሙር ቃላቶችን ለማጋራት የተዘጋጀ ነው። ሁሉም መዝሙሮችን ያስሱ እና ክርስቶስን ያሞካሹ!',
      type: 'Announcement',
      isActive: true
    });
    console.log('Welcome message seeded');
  }
}
