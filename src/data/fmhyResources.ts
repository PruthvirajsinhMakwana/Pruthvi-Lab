// FMHY Resources Data - Curated from freemediaheckyeah.net

export type ResourceCategory = 
  | "streaming"
  | "gaming"
  | "downloading"
  | "torrenting"
  | "educational"
  | "gaming-tools"
  | "software"
  | "privacy"
  | "ai-tools"
  | "audio-music"
  | "reading"
  | "mobile"
  | "tools"
  | "anime";

export type ResourceSubcategory = string;

export interface Resource {
  id: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
  mirrors?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface SubcategoryData {
  name: string;
  resources: Resource[];
}

export interface CategoryData {
  id: ResourceCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories: SubcategoryData[];
}

export const resourceCategories: CategoryData[] = [
  {
    id: "streaming",
    name: "Streaming",
    description: "Stream movies, TV shows, anime, and more",
    icon: "Play",
    color: "from-red-500 to-pink-500",
    subcategories: [
      {
        name: "Multi-Server Sites",
        resources: [
          { id: "cineby", name: "Cineby", url: "https://www.cineby.gd/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"], isFeatured: true },
          { id: "xprime", name: "XPrime", url: "https://xprime.today/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"], mirrors: ["https://xprime.stream/"] },
          { id: "rive", name: "Rive", url: "https://rivestream.org/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"], mirrors: ["https://rivestream.net/", "https://www.rivestream.app/"], isFeatured: true },
          { id: "pstream", name: "P-Stream", url: "https://pstream.mov/", description: "Movies / TV / Anime / Auto-Next / Desktop App", tags: ["movies", "tv", "anime", "desktop"] },
          { id: "aether", name: "Aether", url: "https://aether.mom/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
          { id: "flickystream", name: "FlickyStream", url: "https://flickystream.ru/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
          { id: "cinemora", name: "CineMora", url: "https://cinemora.ru/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
          { id: "veloratv", name: "VeloraTV", url: "https://veloratv.ru/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
          { id: "cinegram", name: "Cinegram", url: "https://cinegram.net/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
        ]
      },
      {
        name: "Single Server",
        resources: [
          { id: "nepu", name: "NEPU", url: "https://nepu.to/", description: "Movies / TV / Anime / Auto-Next / 4K", tags: ["movies", "tv", "anime", "4k"], isFeatured: true },
          { id: "ee3", name: "EE3", url: "https://ee3.me/", description: "Movies / Invite Codes: mpgh or 1hack", tags: ["movies"] },
          { id: "yflix", name: "yFlix", url: "https://yflix.to/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
          { id: "cinemacity", name: "CinemaCity", url: "https://cinemacity.cc/", description: "Movies / TV / Anime / Requires Sign-Up", tags: ["movies", "tv", "anime"] },
          { id: "ridomovies", name: "RidoMovies", url: "https://ridomovies.tv/", description: "Movies / TV", tags: ["movies", "tv"] },
          { id: "watchflix", name: "WatchFlix", url: "https://watchflix.to/", description: "Movies / TV / Anime / 720p", tags: ["movies", "tv", "anime"] },
        ]
      },
      {
        name: "Stream Aggregators",
        resources: [
          { id: "flixer", name: "Flixer", url: "https://flixer.sh/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"], isFeatured: true },
          { id: "hexa", name: "Hexa", url: "https://hexa.su/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
          { id: "cinezo", name: "Cinezo", url: "https://www.cinezo.net/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
          { id: "bcine", name: "bCine", url: "https://bcine.app/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
          { id: "filmex", name: "Filmex", url: "https://filmex.to/", description: "Movies / TV / Anime / Auto-Next / 4K", tags: ["movies", "tv", "anime", "4k"] },
          { id: "vidbox", name: "Vidbox", url: "https://vidbox.cc/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
          { id: "willow", name: "Willow", url: "https://willow.arlen.icu/", description: "Movies / TV / Anime / Auto-Next / 4K Guide", tags: ["movies", "tv", "anime", "4k"] },
          { id: "cinemaos", name: "CinemaOS", url: "https://cinemaos.live/", description: "Movies / TV / Anime / Auto-Next", tags: ["movies", "tv", "anime"] },
        ]
      },
      {
        name: "Anime Streaming",
        resources: [
          { id: "aniwave", name: "AniWave", url: "https://aniwave.live/", description: "Sub / Dub / Auto-Next", tags: ["anime", "sub", "dub"], isFeatured: true },
          { id: "hianime", name: "HiAnime", url: "https://hianime.nz/", description: "Sub / Dub / Auto-Next", tags: ["anime", "sub", "dub"], isFeatured: true },
          { id: "kickassanime", name: "KickAssAnime", url: "https://kickassanime.am/", description: "Sub / Dub / Auto-Next", tags: ["anime", "sub", "dub"] },
          { id: "animefox", name: "AnimeFox", url: "https://animefox.cc/", description: "Sub / Dub", tags: ["anime", "sub", "dub"] },
          { id: "animepahe", name: "AnimePahe", url: "https://animepahe.ru/", description: "Sub / Low File Size", tags: ["anime", "sub"] },
        ]
      },
      {
        name: "Free w/ Ads (Legal)",
        resources: [
          { id: "tubi", name: "Tubi", url: "https://tubitv.com/", description: "Movies / TV / 720p / Legal", tags: ["movies", "tv", "legal"] },
          { id: "plex", name: "Plex", url: "https://watch.plex.tv/", description: "Movies / TV / 720p / Legal", tags: ["movies", "tv", "legal"] },
          { id: "pluto", name: "Pluto", url: "https://pluto.tv/", description: "Movies / TV / 720p / Legal", tags: ["movies", "tv", "legal"] },
          { id: "roku", name: "Roku Channel", url: "https://therokuchannel.roku.com/", description: "Movies / TV / US Only", tags: ["movies", "tv", "legal"] },
          { id: "vudu", name: "Vudu", url: "https://www.vudu.com/content/movies/uxpage/View-All-Free-Movies-TV/207", description: "Movies / TV / US Only", tags: ["movies", "tv", "legal"] },
        ]
      }
    ]
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Download games, ROMs, and gaming resources",
    icon: "Gamepad2",
    color: "from-green-500 to-emerald-500",
    subcategories: [
      {
        name: "Game Downloads",
        resources: [
          { id: "csrin", name: "CS.RIN.RU", url: "https://cs.rin.ru/forum", description: "Download / Torrent / Signup / PW: cs.rin.ru", tags: ["games", "pc"], isFeatured: true },
          { id: "steamrip", name: "SteamRIP", url: "https://steamrip.com/", description: "Download / Pre-Installed", tags: ["games", "pc", "preinstalled"], isFeatured: true },
          { id: "ankergames", name: "AnkerGames", url: "https://ankergames.net/", description: "Download / Torrent / Pre-Installed", tags: ["games", "pc", "preinstalled"] },
          { id: "goggames", name: "GOG Games", url: "https://gog-games.to/", description: "Download / Torrent / GOG Games Only", tags: ["games", "gog", "drm-free"] },
          { id: "unioncrax", name: "UnionCrax", url: "https://union-crax.xyz/", description: "Download / Pre-Installed", tags: ["games", "pc", "preinstalled"] },
          { id: "astralgames", name: "AstralGames", url: "https://astral-games.xyz/", description: "Download / Achievements / Pre-Installed", tags: ["games", "pc", "achievements"] },
          { id: "onlinefix", name: "Online Fix", url: "https://online-fix.me/", description: "Download / Torrent / Multiplayer", tags: ["games", "multiplayer"] },
          { id: "ovagames", name: "Ova Games", url: "https://www.ovagames.com/", description: "Download / PW: www.ovagames.com", tags: ["games", "pc"] },
        ]
      },
      {
        name: "Game Repacks",
        resources: [
          { id: "fitgirl", name: "FitGirl Repacks", url: "https://fitgirl-repacks.site/", description: "Download / Torrent / ROM Repacks", tags: ["repacks", "compressed"], isFeatured: true },
          { id: "kaoskrew", name: "KaOsKrew", url: "https://kaoskrew.org/", description: "Download / Torrent", tags: ["repacks", "compressed"] },
          { id: "dodi", name: "DODI Repacks", url: "https://dodi-repacks.site/", description: "Torrent / Requires Redirect Bypass", tags: ["repacks", "compressed"] },
          { id: "m4ckd0ge", name: "M4CKD0GE Repacks", url: "https://m4ckd0ge-repacks.site/", description: "Download", tags: ["repacks", "compressed"] },
          { id: "xatab", name: "Xatab Repacks", url: "https://byxatab.com/", description: "Torrent / Use Translator", tags: ["repacks", "compressed", "russian"] },
          { id: "elamigos", name: "Elamigos", url: "https://elamigos.site/", description: "Download", tags: ["repacks", "compressed"] },
        ]
      },
      {
        name: "ROMs & Emulation",
        resources: [
          { id: "vimm", name: "Vimm's Lair", url: "https://vimm.net/", description: "ROMs / Emulators", tags: ["roms", "emulation"], isFeatured: true },
          { id: "romsfun", name: "RomsFun", url: "https://romsfun.com/", description: "ROMs", tags: ["roms", "emulation"] },
          { id: "cdromance", name: "CDRomance", url: "https://cdromance.org/", description: "ROMs / Retro", tags: ["roms", "emulation", "retro"] },
          { id: "romsmania", name: "RomsMania", url: "https://romsmania.cc/", description: "ROMs", tags: ["roms", "emulation"] },
          { id: "emulatorzone", name: "Emulator Zone", url: "https://www.emulator-zone.com/", description: "Emulators", tags: ["emulators"] },
        ]
      },
      {
        name: "VR Gaming",
        resources: [
          { id: "vrpirates", name: "VRPirates", url: "https://vrpirates.wiki/", description: "VR Piracy Wiki", tags: ["vr", "wiki"], isFeatured: true },
          { id: "sidequest", name: "SideQuest", url: "https://sidequestvr.com/", description: "VR Sideloading Platform", tags: ["vr", "oculus", "quest"] },
          { id: "vrcarena", name: "VRCArena", url: "https://www.vrcarena.com/", description: "Resources for Social VR Games", tags: ["vr", "social"] },
        ]
      },
      {
        name: "Abandonware / Retro",
        resources: [
          { id: "myabandonware", name: "My Abandonware", url: "https://www.myabandonware.com/", description: "Abandonware Games", tags: ["abandonware", "retro"], isFeatured: true },
          { id: "abandonwaregames", name: "AbandonwareGames", url: "https://abandonwaregames.net/", description: "Abandonware", tags: ["abandonware", "retro"] },
          { id: "retroexo", name: "Retro eXo", url: "https://www.retro-exo.com/", description: "Abandonware / Retro PC Games / Torrents", tags: ["abandonware", "retro", "torrent"] },
          { id: "zombslair", name: "Zombs-Lair", url: "https://www.zombs-lair.com/", description: "Abandonware", tags: ["abandonware", "retro"] },
          { id: "collectionchamber", name: "CollectionChamber", url: "https://collectionchamber.blogspot.com/", description: "Abandonware", tags: ["abandonware", "retro"] },
        ]
      }
    ]
  },
  {
    id: "downloading",
    name: "Downloading",
    description: "Direct download sites, software, and open directories",
    icon: "Download",
    color: "from-blue-500 to-cyan-500",
    subcategories: [
      {
        name: "Download Directories",
        resources: [
          { id: "opendirectories", name: "r/opendirectories", url: "https://www.reddit.com/r/opendirectories/", description: "Open Directories Subreddit", tags: ["directory", "reddit"], isFeatured: true },
          { id: "eyedex", name: "EyeDex", url: "https://www.eyedex.org/", description: "Open Directory Search Engine", tags: ["directory", "search"] },
          { id: "odcrawler", name: "ODCrawler", url: "https://odcrawler.xyz/", description: "Open Directory Search Engine", tags: ["directory", "search"] },
          { id: "nicotine", name: "Nicotine+", url: "https://nicotine-plus.org/", description: "File Sharing App", tags: ["p2p", "soulseek"] },
          { id: "soulseek", name: "Soulseek", url: "https://slsknet.org/", description: "File Sharing App", tags: ["p2p", "music"] },
        ]
      },
      {
        name: "Download Sites",
        resources: [
          { id: "internetarchive", name: "Internet Archive", url: "https://archive.org/", description: "Video / Audio / Books / Magazines / ROMs", tags: ["archive", "everything"], isFeatured: true },
          { id: "softarchive", name: "SoftArchive", url: "https://softarchive.download/", description: "Audio / Books / Comics / Magazines", tags: ["multi"], mirrors: ["https://sanet.lc/", "https://sanet.st/"] },
          { id: "maxrelease", name: "MaxRelease", url: "https://max-rls.com/", description: "Video / Audio / Magazines", tags: ["multi"] },
          { id: "scnlog", name: "SCNLOG", url: "https://scnlog.me/", description: "Video / Audio / ROMs / Books", tags: ["multi", "scene"] },
          { id: "scenesource", name: "SceneSource", url: "https://www.scnsrc.me/", description: "Video / Audio / ROMs / Books", tags: ["multi", "scene"] },
        ]
      },
      {
        name: "Software Sites",
        resources: [
          { id: "cracksurl", name: "CracksURL", url: "https://cracksurl.com/", description: "Software Downloads", tags: ["software"], isFeatured: true },
          { id: "lrepacks", name: "LRepacks", url: "https://lrepacks.net/", description: "Software / Use Translator", tags: ["software", "russian"] },
          { id: "soft98", name: "soft98", url: "https://soft98.ir/", description: "Software / Use Translator", tags: ["software"] },
          { id: "mobilism", name: "Mobilism", url: "https://forum.mobilism.org/", description: "Apps / Books / Requires Sign-Up", tags: ["apps", "mobile"] },
          { id: "nsaneforums", name: "Nsane Forums", url: "https://www.nsaneforums.com/", description: "Software / Requires Sign-Up", tags: ["software", "forum"] },
        ]
      },
      {
        name: "FOSS / Freeware",
        resources: [
          { id: "awesomeopensource", name: "Awesome Open Source", url: "https://awesomeopensource.com/", description: "FOSS Index", tags: ["foss", "opensource"], isFeatured: true },
          { id: "sourceforge", name: "SourceForge", url: "https://sourceforge.net/", description: "FOSS Repositories", tags: ["foss", "opensource"] },
          { id: "alternativeto", name: "AlternativeTo", url: "https://alternativeto.net/", description: "Crowdsourced Software Recommendations", tags: ["alternatives", "recommendations"] },
          { id: "fosshub", name: "FossHub", url: "https://www.fosshub.com/", description: "FOSS Directory", tags: ["foss", "opensource"] },
          { id: "portableapps", name: "PortableApps", url: "https://portableapps.com/", description: "Portable Apps", tags: ["portable", "freeware"] },
        ]
      }
    ]
  },
  {
    id: "torrenting",
    name: "Torrenting",
    description: "Torrent sites, clients, and trackers",
    icon: "Share2",
    color: "from-purple-500 to-violet-500",
    subcategories: [
      {
        name: "Torrent Sites",
        resources: [
          { id: "rutracker", name: "RuTracker", url: "https://rutracker.org/", description: "Video / Audio / Comics / Magazines / Software", tags: ["general", "russian"], isFeatured: true },
          { id: "1337x", name: "1337x", url: "https://1337x.to/", description: "Video / Audio / NSFW", tags: ["general"], isFeatured: true },
          { id: "rarbgdump", name: "RARBG Dump", url: "https://rarbgdump.com/", description: "Video / Audio / Games / Books", tags: ["general"] },
          { id: "limetorrents", name: "LimeTorrents", url: "https://www.limetorrents.lol/", description: "Video / Audio / Books", tags: ["general"] },
          { id: "torrentdownloads", name: "TorrentDownloads", url: "https://www.torrentdownloads.pro/", description: "Video / Audio / Books", tags: ["general"] },
        ]
      },
      {
        name: "Aggregators",
        resources: [
          { id: "ext", name: "ExT", url: "https://ext.to/", description: "Multi-Site Aggregator", tags: ["aggregator"], isFeatured: true },
          { id: "btdigg", name: "BTDigg", url: "https://btdig.com/", description: "DHT-Based Search", tags: ["aggregator", "dht"] },
          { id: "knaben", name: "Knaben", url: "https://knaben.org/", description: "Multi-Site Aggregator", tags: ["aggregator"] },
          { id: "torrentquest", name: "TorrentQuest", url: "https://torrentquest.com/", description: "Multi-Site Aggregator", tags: ["aggregator"] },
          { id: "snowfl", name: "snowfl", url: "https://snowfl.com/", description: "Multi-Site Aggregator", tags: ["aggregator"] },
        ]
      },
      {
        name: "Torrent Clients",
        resources: [
          { id: "qbittorrent", name: "qBittorrent", url: "https://www.qbittorrent.org/", description: "Best Open-Source Torrent Client", tags: ["client", "opensource"], isFeatured: true },
          { id: "deluge", name: "Deluge", url: "https://www.deluge-torrent.org/", description: "Lightweight Torrent Client", tags: ["client", "opensource"] },
          { id: "transmission", name: "Transmission", url: "https://transmissionbt.com/", description: "Simple Torrent Client", tags: ["client", "opensource"] },
          { id: "biglybt", name: "BiglyBT", url: "https://www.biglybt.com/", description: "Feature-Rich Client", tags: ["client", "opensource"] },
        ]
      },
      {
        name: "Remote Torrenting",
        resources: [
          { id: "torbox", name: "TorBox", url: "https://torbox.app/", description: "Freemium / 10GB / 10 Monthly Downloads", tags: ["debrid", "cloud"], isFeatured: true },
          { id: "seedr", name: "Seedr", url: "https://www.seedr.cc/", description: "2GB Free Cloud Torrenting", tags: ["debrid", "cloud"] },
          { id: "webtor", name: "webtor", url: "https://webtor.io/", description: "No Limit / Speed Limited / No Sign-Up", tags: ["cloud", "streaming"] },
          { id: "realdebrid", name: "Real-Debrid", url: "https://real-debrid.com/", description: "Paid Debrid Service", tags: ["debrid", "premium"] },
        ]
      }
    ]
  },
  {
    id: "educational",
    name: "Educational",
    description: "Courses, documentaries, and learning resources",
    icon: "GraduationCap",
    color: "from-yellow-500 to-orange-500",
    subcategories: [
      {
        name: "Documentaries",
        resources: [
          { id: "ihavenotv", name: "IHaveNoTV", url: "https://ihavenotv.com/", description: "Documentary Streaming", tags: ["documentaries"], isFeatured: true },
          { id: "documentaryarea", name: "DocumentaryArea", url: "https://www.documentaryarea.com/", description: "Documentary Streaming", tags: ["documentaries"] },
          { id: "docplus", name: "Documentary+", url: "https://www.docplus.com/", description: "Documentary Streaming", tags: ["documentaries"] },
          { id: "topdocumentaryfilms", name: "Top Documentary Films", url: "https://topdocumentaryfilms.com/", description: "Documentary Streaming", tags: ["documentaries"] },
          { id: "thoughtmaybe", name: "Thought Maybe", url: "https://thoughtmaybe.com/", description: "Documentary Streaming", tags: ["documentaries"] },
        ]
      },
      {
        name: "Online Courses",
        resources: [
          { id: "awesomecourses", name: "Awesome Courses", url: "https://github.com/prakhar1989/awesome-courses/", description: "Course Index", tags: ["courses", "programming"], isFeatured: true },
          { id: "edx", name: "edX", url: "https://www.edx.org/", description: "University Courses", tags: ["courses", "university"] },
          { id: "mitocw", name: "MIT OpenCourseWare", url: "https://ocw.mit.edu/", description: "MIT Courses", tags: ["courses", "university"], isFeatured: true },
          { id: "khanacademy", name: "Khan Academy", url: "https://www.khanacademy.org/", description: "Free Courses", tags: ["courses", "free"] },
          { id: "classcentral", name: "Class Central", url: "https://www.classcentral.com/", description: "Search for Courses", tags: ["courses", "search"] },
          { id: "tutflix", name: "TutFlix", url: "https://tutflix.org/", description: "Courses / Drives", tags: ["courses", "downloads"] },
          { id: "hacksnation", name: "HackNation", url: "https://hacksnation.com/", description: "Tech Courses", tags: ["courses", "tech"] },
        ]
      },
      {
        name: "Learning Sites",
        resources: [
          { id: "learnanything", name: "Learn Anything", url: "https://learn-anything.xyz/", description: "Learning Resource Search", tags: ["learning", "search"], isFeatured: true },
          { id: "openculture", name: "OpenCulture", url: "https://www.openculture.com/", description: "Learning Resources", tags: ["learning", "culture"] },
          { id: "ossu", name: "OSSU", url: "https://github.com/ossu/", description: "Open Source University", tags: ["learning", "curriculum"] },
          { id: "phet", name: "PhET", url: "https://phet.colorado.edu/", description: "Interactive Science Lessons", tags: ["learning", "science"] },
          { id: "crashcourse", name: "Crash Course", url: "https://thecrashcourse.com/", description: "Topic Crash Courses", tags: ["learning", "video"] },
        ]
      },
      {
        name: "Music Learning",
        resources: [
          { id: "muted", name: "Muted.io", url: "https://muted.io/", description: "Music Theory Tools", tags: ["music", "theory"], isFeatured: true },
          { id: "openmusictheory", name: "Open Music Theory", url: "https://viva.pressbooks.pub/openmusictheory/", description: "Music Theory Course", tags: ["music", "theory"] },
          { id: "musictheory", name: "musictheory.net", url: "https://www.musictheory.net/", description: "Music Theory Lessons", tags: ["music", "theory"] },
          { id: "learningmusic", name: "Learning Music", url: "https://learningmusic.ableton.com/", description: "Music Making Lessons", tags: ["music", "production"] },
        ]
      },
      {
        name: "Language Learning",
        resources: [
          { id: "languagepod101", name: "LanguagePod101", url: "https://www.languagepod101.com/", description: "Language Courses", tags: ["language"], isFeatured: true },
          { id: "duolingo", name: "Duolingo", url: "https://www.duolingo.com/", description: "Free Language Learning", tags: ["language", "free"] },
          { id: "busuu", name: "Busuu", url: "https://www.busuu.com/", description: "Language Learning Platform", tags: ["language"] },
          { id: "anki", name: "Anki", url: "https://apps.ankiweb.net/", description: "Flashcard App", tags: ["flashcards", "memorization"] },
        ]
      }
    ]
  },
  {
    id: "gaming-tools",
    name: "Gaming Tools",
    description: "Optimization, launchers, mods, and utilities",
    icon: "Wrench",
    color: "from-teal-500 to-green-500",
    subcategories: [
      {
        name: "Game Launchers",
        resources: [
          { id: "playnite", name: "Playnite", url: "https://playnite.link/", description: "Game Library / Launcher", tags: ["launcher", "library"], isFeatured: true },
          { id: "ascendara", name: "Ascendara", url: "https://ascendara.app/", description: "Game Library / Launcher / Downloader", tags: ["launcher", "downloader"] },
          { id: "hydra", name: "Hydra", url: "https://hydralauncher.gg/", description: "Game Launcher / Torrent Client", tags: ["launcher", "torrent"], isFeatured: true },
          { id: "projectgld", name: "Project GLD", url: "https://y0urd34th.github.io/Project-GLD/", description: "Game Library / Launcher", tags: ["launcher", "library"] },
          { id: "goggalaxy", name: "GOG Galaxy", url: "https://www.gog.com/galaxy", description: "Game Library / Launcher", tags: ["launcher", "library", "gog"] },
        ]
      },
      {
        name: "Optimization Tools",
        resources: [
          { id: "specialk", name: "SpecialK", url: "https://www.special-k.info/", description: "Game Optimization Tool", tags: ["optimization"], isFeatured: true },
          { id: "msiafterburner", name: "MSI Afterburner", url: "https://www.msi.com/Landing/afterburner", description: "Overclocking / Hardware Monitor", tags: ["overclocking", "monitoring"] },
          { id: "displaymagician", name: "DisplayMagician", url: "https://displaymagician.littlebitbig.com/", description: "Per-Game Display Profiles", tags: ["display", "profiles"] },
          { id: "reshade", name: "ReShade", url: "https://reshade.me/", description: "Post-Processing Injector", tags: ["graphics", "shaders"] },
          { id: "dlssswapper", name: "DLSS Swapper", url: "https://github.com/beeradmoore/dlss-swapper", description: "Download & Swap DLSS", tags: ["nvidia", "dlss"] },
        ]
      },
      {
        name: "Game Mods",
        resources: [
          { id: "nexusmods", name: "Nexus Mods", url: "https://www.nexusmods.com/", description: "Game Mods Hub", tags: ["mods"], isFeatured: true },
          { id: "moddb", name: "ModDB", url: "https://moddb.com/", description: "Game Mods", tags: ["mods"] },
          { id: "gamebanana", name: "GameBanana", url: "https://gamebanana.com/", description: "Game Mods", tags: ["mods"] },
          { id: "modorganizer", name: "ModOrganizer", url: "https://github.com/ModOrganizer2/modorganizer", description: "Mod Manager", tags: ["mods", "manager"] },
          { id: "wabbajack", name: "WabbaJack", url: "https://www.wabbajack.org/", description: "Automated Modlist Installer", tags: ["mods", "automation"] },
        ]
      },
      {
        name: "Controller Tools",
        resources: [
          { id: "ds4windows", name: "DS4Windows", url: "https://github.com/schmaldeo/DS4Windows", description: "Gamepad Input Tool", tags: ["controller", "ds4"], isFeatured: true },
          { id: "x360ce", name: "x360ce", url: "https://www.x360ce.com/", description: "DS4 / 360 Controller Emulator", tags: ["controller", "emulator"] },
          { id: "dualsensex", name: "DualSenseX", url: "https://github.com/Paliverse/DualSenseX", description: "DualSense Controller Tool", tags: ["controller", "dualsense"] },
          { id: "antimicrox", name: "AntiMicroX", url: "https://github.com/AntiMicroX/antimicroX", description: "Controller Remapping", tags: ["controller", "remapping"] },
        ]
      },
      {
        name: "Gaming Utilities",
        resources: [
          { id: "pcgamingwiki", name: "PCGamingWiki", url: "https://www.pcgamingwiki.com/", description: "Game Fixes & Workarounds", tags: ["wiki", "fixes"], isFeatured: true },
          { id: "howlongtobeat", name: "HowLongToBeat", url: "https://howlongtobeat.com/", description: "Find Average Game Lengths", tags: ["playtime", "info"] },
          { id: "gamepauser", name: "Game Pauser", url: "https://madebyjase.com/game-pauser/", description: "Pause Unpausable Cutscenes", tags: ["utility"] },
          { id: "sunshine", name: "Sunshine", url: "https://app.lizardbyte.dev/Sunshine/", description: "Remote Gaming Server", tags: ["streaming", "remote"] },
          { id: "moonlight", name: "Moonlight", url: "https://moonlight-stream.org/", description: "Gaming Remote Desktop Client", tags: ["streaming", "remote"] },
        ]
      }
    ]
  },
  {
    id: "privacy",
    name: "Privacy & Security",
    description: "VPNs, adblockers, and privacy tools",
    icon: "Shield",
    color: "from-indigo-500 to-purple-500",
    subcategories: [
      {
        name: "Ad Blockers",
        resources: [
          { id: "ublockorigin", name: "uBlock Origin", url: "https://ublockorigin.com/", description: "Best Ad Blocker Extension", tags: ["adblock", "extension"], isFeatured: true },
          { id: "adguard", name: "AdGuard", url: "https://adguard.com/", description: "Ad Blocker App", tags: ["adblock", "app"] },
          { id: "pihole", name: "Pi-hole", url: "https://pi-hole.net/", description: "Network-Wide Ad Blocking", tags: ["adblock", "network"] },
          { id: "brave", name: "Brave Browser", url: "https://brave.com/", description: "Privacy Browser with Built-in Ad Blocker", tags: ["browser", "adblock"] },
        ]
      },
      {
        name: "VPN Services",
        resources: [
          { id: "mullvad", name: "Mullvad", url: "https://mullvad.net/", description: "Privacy-Focused VPN", tags: ["vpn", "privacy"], isFeatured: true },
          { id: "protonvpn", name: "ProtonVPN", url: "https://protonvpn.com/", description: "Free Tier Available", tags: ["vpn", "free"] },
          { id: "windscribe", name: "Windscribe", url: "https://windscribe.com/", description: "Free Tier Available", tags: ["vpn", "free"] },
          { id: "ivpn", name: "IVPN", url: "https://www.ivpn.net/", description: "Privacy-Focused VPN", tags: ["vpn", "privacy"] },
        ]
      },
      {
        name: "Privacy Browsers",
        resources: [
          { id: "firefox", name: "Firefox", url: "https://www.mozilla.org/firefox/", description: "Privacy-Focused Browser", tags: ["browser", "privacy"], isFeatured: true },
          { id: "tor", name: "Tor Browser", url: "https://www.torproject.org/", description: "Anonymous Browsing", tags: ["browser", "anonymous"] },
          { id: "librewolf", name: "LibreWolf", url: "https://librewolf.net/", description: "Privacy-Hardened Firefox Fork", tags: ["browser", "privacy"] },
        ]
      },
      {
        name: "Privacy Tools",
        resources: [
          { id: "bitwarden", name: "Bitwarden", url: "https://bitwarden.com/", description: "Password Manager", tags: ["passwords", "security"], isFeatured: true },
          { id: "simplelogin", name: "SimpleLogin", url: "https://simplelogin.io/", description: "Email Aliasing", tags: ["email", "privacy"] },
          { id: "privacyguides", name: "Privacy Guides", url: "https://www.privacyguides.org/", description: "Privacy Resources", tags: ["guides", "resources"] },
        ]
      }
    ]
  },
  {
    id: "ai-tools",
    name: "AI Tools",
    description: "AI chatbots, image generators, and machine learning tools",
    icon: "Sparkles",
    color: "from-pink-500 to-rose-500",
    subcategories: [
      {
        name: "AI Chatbots",
        resources: [
          { id: "chatgpt", name: "ChatGPT", url: "https://chat.openai.com/", description: "OpenAI's AI Assistant", tags: ["chatbot", "gpt", "ai"], isFeatured: true },
          { id: "claude", name: "Claude", url: "https://claude.ai/", description: "Anthropic's AI Assistant", tags: ["chatbot", "ai"], isFeatured: true },
          { id: "perplexity", name: "Perplexity", url: "https://www.perplexity.ai/", description: "AI Search Engine", tags: ["search", "ai"], isFeatured: true },
          { id: "gemini", name: "Google Gemini", url: "https://gemini.google.com/", description: "Google's AI Assistant", tags: ["chatbot", "google", "ai"] },
          { id: "copilot", name: "Microsoft Copilot", url: "https://copilot.microsoft.com/", description: "Microsoft's AI Assistant", tags: ["chatbot", "microsoft", "ai"] },
          { id: "poe", name: "Poe", url: "https://poe.com/", description: "Multi-Model AI Platform", tags: ["chatbot", "multi-model", "ai"] },
          { id: "phind", name: "Phind", url: "https://www.phind.com/", description: "AI for Developers", tags: ["coding", "developer", "ai"] },
          { id: "huggingchat", name: "HuggingChat", url: "https://huggingface.co/chat/", description: "Open Source AI Chat", tags: ["chatbot", "opensource", "ai"] },
        ]
      },
      {
        name: "AI Image Generation",
        resources: [
          { id: "midjourney", name: "Midjourney", url: "https://www.midjourney.com/", description: "AI Art Generator", tags: ["image", "art", "ai"], isFeatured: true },
          { id: "dalle", name: "DALL-E", url: "https://openai.com/dall-e-3", description: "OpenAI Image Generator", tags: ["image", "openai", "ai"] },
          { id: "stable-diffusion", name: "Stable Diffusion", url: "https://stability.ai/", description: "Open Source Image AI", tags: ["image", "opensource", "ai"], isFeatured: true },
          { id: "leonardo", name: "Leonardo.AI", url: "https://leonardo.ai/", description: "AI Art Platform", tags: ["image", "art", "ai"] },
          { id: "playground", name: "Playground AI", url: "https://playground.com/", description: "Free AI Image Generator", tags: ["image", "free", "ai"] },
          { id: "ideogram", name: "Ideogram", url: "https://ideogram.ai/", description: "AI with Better Text Rendering", tags: ["image", "text", "ai"] },
          { id: "flux", name: "Flux", url: "https://flux1.ai/", description: "Fast AI Image Generator", tags: ["image", "fast", "ai"] },
          { id: "bing-image-creator", name: "Bing Image Creator", url: "https://www.bing.com/images/create", description: "Free DALL-E 3 Access", tags: ["image", "free", "ai"] },
        ]
      },
      {
        name: "AI Video Generation",
        resources: [
          { id: "runway", name: "Runway", url: "https://runwayml.com/", description: "AI Video Generation & Editing", tags: ["video", "editing", "ai"], isFeatured: true },
          { id: "pika", name: "Pika", url: "https://pika.art/", description: "AI Video Generator", tags: ["video", "ai"] },
          { id: "luma", name: "Luma Dream Machine", url: "https://lumalabs.ai/dream-machine", description: "AI Video from Text/Image", tags: ["video", "ai"] },
          { id: "hailuoai", name: "Hailuo AI", url: "https://hailuoai.video/", description: "AI Video Generation", tags: ["video", "ai"] },
          { id: "kling", name: "Kling AI", url: "https://klingai.com/", description: "AI Video & Image Generation", tags: ["video", "image", "ai"] },
        ]
      },
      {
        name: "AI Audio & Voice",
        resources: [
          { id: "elevenlabs", name: "ElevenLabs", url: "https://elevenlabs.io/", description: "AI Voice Generation & Cloning", tags: ["voice", "tts", "ai"], isFeatured: true },
          { id: "murf", name: "Murf.AI", url: "https://murf.ai/", description: "AI Voice Over Generator", tags: ["voice", "tts", "ai"] },
          { id: "resemble", name: "Resemble AI", url: "https://www.resemble.ai/", description: "AI Voice Cloning", tags: ["voice", "cloning", "ai"] },
          { id: "play-ht", name: "Play.ht", url: "https://play.ht/", description: "AI Voice Generator", tags: ["voice", "tts", "ai"] },
          { id: "suno", name: "Suno", url: "https://suno.ai/", description: "AI Music Generation", tags: ["music", "ai"], isFeatured: true },
          { id: "udio", name: "Udio", url: "https://www.udio.com/", description: "AI Music Creation", tags: ["music", "ai"] },
        ]
      },
      {
        name: "AI Writing & Productivity",
        resources: [
          { id: "notion-ai", name: "Notion AI", url: "https://www.notion.so/product/ai", description: "AI Writing in Notion", tags: ["writing", "productivity", "ai"], isFeatured: true },
          { id: "grammarly", name: "Grammarly", url: "https://www.grammarly.com/", description: "AI Writing Assistant", tags: ["writing", "grammar", "ai"] },
          { id: "quillbot", name: "QuillBot", url: "https://quillbot.com/", description: "AI Paraphrasing Tool", tags: ["writing", "paraphrase", "ai"] },
          { id: "copy-ai", name: "Copy.ai", url: "https://www.copy.ai/", description: "AI Marketing Copy", tags: ["writing", "marketing", "ai"] },
          { id: "jasper", name: "Jasper", url: "https://www.jasper.ai/", description: "AI Content Creation", tags: ["writing", "content", "ai"] },
          { id: "sudowrite", name: "Sudowrite", url: "https://www.sudowrite.com/", description: "AI for Creative Writing", tags: ["writing", "fiction", "ai"] },
        ]
      },
      {
        name: "AI Coding",
        resources: [
          { id: "github-copilot", name: "GitHub Copilot", url: "https://github.com/features/copilot", description: "AI Pair Programmer", tags: ["coding", "github", "ai"], isFeatured: true },
          { id: "cursor", name: "Cursor", url: "https://cursor.sh/", description: "AI Code Editor", tags: ["coding", "editor", "ai"], isFeatured: true },
          { id: "codeium", name: "Codeium", url: "https://codeium.com/", description: "Free AI Code Completion", tags: ["coding", "free", "ai"] },
          { id: "tabnine", name: "Tabnine", url: "https://www.tabnine.com/", description: "AI Code Completions", tags: ["coding", "ai"] },
          { id: "replit-ai", name: "Replit AI", url: "https://replit.com/ai", description: "AI-Powered Development", tags: ["coding", "ide", "ai"] },
          { id: "v0", name: "v0 by Vercel", url: "https://v0.dev/", description: "AI UI Component Generator", tags: ["coding", "ui", "ai"] },
        ]
      },
      {
        name: "Local AI & Self-Hosted",
        resources: [
          { id: "ollama", name: "Ollama", url: "https://ollama.ai/", description: "Run LLMs Locally", tags: ["local", "llm", "ai"], isFeatured: true },
          { id: "lmstudio", name: "LM Studio", url: "https://lmstudio.ai/", description: "Local LLM Desktop App", tags: ["local", "desktop", "ai"] },
          { id: "jan", name: "Jan", url: "https://jan.ai/", description: "Offline AI Assistant", tags: ["local", "offline", "ai"] },
          { id: "gpt4all", name: "GPT4All", url: "https://gpt4all.io/", description: "Free Local AI", tags: ["local", "free", "ai"] },
          { id: "localai", name: "LocalAI", url: "https://localai.io/", description: "Self-Hosted AI API", tags: ["local", "api", "ai"] },
        ]
      }
    ]
  },
  {
    id: "audio-music",
    name: "Audio & Music",
    description: "Music streaming, downloads, audio tools, and podcasts",
    icon: "Music",
    color: "from-cyan-500 to-blue-500",
    subcategories: [
      {
        name: "Music Streaming",
        resources: [
          { id: "spotify", name: "Spotify", url: "https://open.spotify.com/", description: "Music Streaming Platform", tags: ["streaming", "music"], isFeatured: true },
          { id: "soundcloud", name: "SoundCloud", url: "https://soundcloud.com/", description: "Music & Audio Platform", tags: ["streaming", "music", "indie"] },
          { id: "bandcamp", name: "Bandcamp", url: "https://bandcamp.com/", description: "Independent Music Platform", tags: ["indie", "music", "buy"] },
          { id: "deezer", name: "Deezer", url: "https://www.deezer.com/", description: "Music Streaming", tags: ["streaming", "music"] },
          { id: "tidal", name: "Tidal", url: "https://tidal.com/", description: "Hi-Fi Music Streaming", tags: ["streaming", "hifi", "music"] },
        ]
      },
      {
        name: "Music Downloads",
        resources: [
          { id: "slavart", name: "Slavart", url: "https://slavart.gamesdrive.net/", description: "FLAC Music Downloads", tags: ["download", "flac", "music"], isFeatured: true },
          { id: "freemp3download", name: "Free-MP3-Download", url: "https://free-mp3-download.net/", description: "MP3 & FLAC Downloads", tags: ["download", "mp3", "music"] },
          { id: "soulseekmusic", name: "Soulseek", url: "https://slsknet.org/", description: "P2P Music Sharing", tags: ["p2p", "music", "download"], isFeatured: true },
          { id: "deemix", name: "Deemix", url: "https://deemix.app/", description: "Deezer Downloader", tags: ["download", "music"] },
          { id: "doubledown", name: "DoubleDouble", url: "https://doubledouble.top/", description: "Music Downloads", tags: ["download", "music"] },
        ]
      },
      {
        name: "Audio Production",
        resources: [
          { id: "audacity", name: "Audacity", url: "https://www.audacityteam.org/", description: "Free Audio Editor", tags: ["editor", "free", "audio"], isFeatured: true },
          { id: "lmms", name: "LMMS", url: "https://lmms.io/", description: "Free DAW", tags: ["daw", "free", "production"] },
          { id: "ardour", name: "Ardour", url: "https://ardour.org/", description: "Open Source DAW", tags: ["daw", "opensource", "production"] },
          { id: "reaper", name: "Reaper", url: "https://www.reaper.fm/", description: "Affordable DAW", tags: ["daw", "affordable", "production"], isFeatured: true },
          { id: "ocenaudio", name: "Ocenaudio", url: "https://www.ocenaudio.com/", description: "Simple Audio Editor", tags: ["editor", "simple", "audio"] },
          { id: "bandlab", name: "BandLab", url: "https://www.bandlab.com/", description: "Free Online DAW", tags: ["daw", "free", "online"] },
        ]
      },
      {
        name: "VST Plugins & Samples",
        resources: [
          { id: "pluginboutique", name: "Plugin Boutique", url: "https://www.pluginboutique.com/", description: "VST Plugin Store", tags: ["vst", "plugins", "audio"], isFeatured: true },
          { id: "splice", name: "Splice", url: "https://splice.com/", description: "Samples & Plugins", tags: ["samples", "plugins", "audio"] },
          { id: "looperman", name: "Looperman", url: "https://www.looperman.com/", description: "Free Loops & Samples", tags: ["samples", "free", "loops"] },
          { id: "cymatics", name: "Cymatics", url: "https://cymatics.fm/", description: "Free Sample Packs", tags: ["samples", "free", "audio"] },
          { id: "bedroom-producers", name: "Bedroom Producers", url: "https://bedroomproducersblog.com/", description: "Free VST & Samples", tags: ["vst", "free", "samples"] },
          { id: "landr", name: "LANDR", url: "https://www.landr.com/", description: "AI Mastering & Samples", tags: ["mastering", "ai", "samples"] },
        ]
      },
      {
        name: "Podcasts",
        resources: [
          { id: "pocketcasts", name: "Pocket Casts", url: "https://pocketcasts.com/", description: "Podcast App", tags: ["podcast", "app"], isFeatured: true },
          { id: "overcast", name: "Overcast", url: "https://overcast.fm/", description: "iOS Podcast App", tags: ["podcast", "ios"] },
          { id: "castbox", name: "Castbox", url: "https://castbox.fm/", description: "Free Podcast App", tags: ["podcast", "free"] },
          { id: "podbean", name: "Podbean", url: "https://www.podbean.com/", description: "Podcast Hosting & Listening", tags: ["podcast", "hosting"] },
          { id: "listennotes", name: "Listen Notes", url: "https://www.listennotes.com/", description: "Podcast Search Engine", tags: ["podcast", "search"] },
        ]
      },
      {
        name: "Radio & Live Audio",
        resources: [
          { id: "radiogardenr", name: "Radio Garden", url: "https://radio.garden/", description: "Global Radio Stations", tags: ["radio", "global", "live"], isFeatured: true },
          { id: "tunein", name: "TuneIn", url: "https://tunein.com/", description: "Radio & Podcasts", tags: ["radio", "podcast", "live"] },
          { id: "iheart", name: "iHeartRadio", url: "https://www.iheart.com/", description: "Radio Streaming", tags: ["radio", "streaming"] },
          { id: "somafm", name: "SomaFM", url: "https://somafm.com/", description: "Commercial-Free Radio", tags: ["radio", "commercial-free"] },
        ]
      }
    ]
  },
  {
    id: "reading",
    name: "Reading",
    description: "Books, comics, manga, magazines, and news",
    icon: "BookOpen",
    color: "from-amber-500 to-yellow-500",
    subcategories: [
      {
        name: "E-Books",
        resources: [
          { id: "annas-archive", name: "Anna's Archive", url: "https://annas-archive.org/", description: "Largest Open Library", tags: ["books", "library", "ebooks"], isFeatured: true },
          { id: "zlibrary", name: "Z-Library", url: "https://z-lib.id/", description: "E-Book Library", tags: ["books", "library", "ebooks"], isFeatured: true },
          { id: "libgen", name: "Library Genesis", url: "https://libgen.is/", description: "Books & Scientific Articles", tags: ["books", "academic", "ebooks"] },
          { id: "pdfdrive", name: "PDF Drive", url: "https://www.pdfdrive.com/", description: "PDF Book Search", tags: ["pdf", "books", "ebooks"] },
          { id: "standardebooks", name: "Standard Ebooks", url: "https://standardebooks.org/", description: "High-Quality Public Domain", tags: ["books", "public-domain", "ebooks"] },
          { id: "gutenberg", name: "Project Gutenberg", url: "https://www.gutenberg.org/", description: "Free Classic Books", tags: ["books", "classic", "ebooks"] },
          { id: "openlibrary", name: "Open Library", url: "https://openlibrary.org/", description: "Digital Library", tags: ["books", "library", "ebooks"] },
          { id: "manybooks", name: "ManyBooks", url: "https://manybooks.net/", description: "Free Ebooks", tags: ["books", "free", "ebooks"] },
        ]
      },
      {
        name: "Manga",
        resources: [
          { id: "mangadex", name: "MangaDex", url: "https://mangadex.org/", description: "Manga Reader", tags: ["manga", "reader"], isFeatured: true },
          { id: "mangakakalot", name: "Mangakakalot", url: "https://mangakakalot.com/", description: "Manga Online", tags: ["manga", "reader"] },
          { id: "mangafire", name: "MangaFire", url: "https://mangafire.to/", description: "Manga Reader", tags: ["manga", "reader"] },
          { id: "mangasee", name: "MangaSee", url: "https://mangasee123.com/", description: "Manga Reader", tags: ["manga", "reader"], isFeatured: true },
          { id: "comick", name: "ComicK", url: "https://comick.io/", description: "Manga & Comics", tags: ["manga", "comics", "reader"] },
          { id: "tachiyomi", name: "Tachiyomi", url: "https://tachiyomi.org/", description: "Manga Reader App", tags: ["manga", "app", "android"] },
        ]
      },
      {
        name: "Comics",
        resources: [
          { id: "readcomiconline", name: "ReadComicOnline", url: "https://readcomiconline.li/", description: "Comics Online", tags: ["comics", "reader"], isFeatured: true },
          { id: "getcomics", name: "GetComics", url: "https://getcomics.org/", description: "Comic Downloads", tags: ["comics", "download"] },
          { id: "comixology", name: "Comixology", url: "https://www.comixology.com/", description: "Digital Comics", tags: ["comics", "digital", "buy"] },
          { id: "webtoon", name: "Webtoon", url: "https://www.webtoons.com/", description: "Web Comics", tags: ["webtoon", "comics", "free"] },
          { id: "tapas", name: "Tapas", url: "https://tapas.io/", description: "Web Comics & Novels", tags: ["webtoon", "novels", "comics"] },
        ]
      },
      {
        name: "Audiobooks",
        resources: [
          { id: "audiobookbay", name: "AudioBook Bay", url: "https://audiobookbay.is/", description: "Audiobook Torrents", tags: ["audiobooks", "torrent"], isFeatured: true },
          { id: "tokybook", name: "Tokybook", url: "https://tokybook.com/", description: "Free Audiobooks", tags: ["audiobooks", "free"] },
          { id: "librivox", name: "LibriVox", url: "https://librivox.org/", description: "Public Domain Audiobooks", tags: ["audiobooks", "free", "public-domain"] },
          { id: "loyalbooks", name: "Loyal Books", url: "https://www.loyalbooks.com/", description: "Free Audiobooks", tags: ["audiobooks", "free"] },
          { id: "storynory", name: "Storynory", url: "https://www.storynory.com/", description: "Kids Audio Stories", tags: ["audiobooks", "kids", "stories"] },
        ]
      },
      {
        name: "Magazines & News",
        resources: [
          { id: "issuu", name: "Issuu", url: "https://issuu.com/", description: "Digital Publishing", tags: ["magazines", "digital"], isFeatured: true },
          { id: "scribd", name: "Scribd", url: "https://www.scribd.com/", description: "Books & Magazines", tags: ["magazines", "books", "subscription"] },
          { id: "pdfmagazines", name: "PDF Magazines", url: "https://pdfmagazines.club/", description: "Magazine Downloads", tags: ["magazines", "pdf", "download"] },
          { id: "magzdb", name: "MagzDB", url: "https://magzdb.org/", description: "Magazine Archive", tags: ["magazines", "archive"] },
          { id: "ground-news", name: "Ground News", url: "https://ground.news/", description: "News Comparison", tags: ["news", "comparison"], isFeatured: true },
          { id: "reuters", name: "Reuters", url: "https://www.reuters.com/", description: "World News", tags: ["news", "world"] },
        ]
      },
      {
        name: "Light Novels & Fiction",
        resources: [
          { id: "novelupdates", name: "NovelUpdates", url: "https://www.novelupdates.com/", description: "Light Novel Tracker", tags: ["lightnovel", "tracker"], isFeatured: true },
          { id: "royalroad", name: "Royal Road", url: "https://www.royalroad.com/", description: "Web Fiction Platform", tags: ["fiction", "webnovel", "free"] },
          { id: "wuxiaworld", name: "WuxiaWorld", url: "https://www.wuxiaworld.com/", description: "Translated Novels", tags: ["lightnovel", "translated"] },
          { id: "ao3", name: "Archive of Our Own", url: "https://archiveofourown.org/", description: "Fanfiction Archive", tags: ["fanfiction", "free"] },
          { id: "scribblehub", name: "ScribbleHub", url: "https://www.scribblehub.com/", description: "Original Web Novels", tags: ["webnovel", "original", "free"] },
        ]
      },
      {
        name: "Academic & Research",
        resources: [
          { id: "scihub", name: "Sci-Hub", url: "https://sci-hub.se/", description: "Scientific Papers", tags: ["academic", "papers", "research"], isFeatured: true },
          { id: "scholar", name: "Google Scholar", url: "https://scholar.google.com/", description: "Academic Search", tags: ["academic", "search", "research"] },
          { id: "arxiv", name: "arXiv", url: "https://arxiv.org/", description: "Preprint Archive", tags: ["academic", "preprint", "research"] },
          { id: "semanticscholar", name: "Semantic Scholar", url: "https://www.semanticscholar.org/", description: "AI Research Search", tags: ["academic", "ai", "search"] },
          { id: "researchgate", name: "ResearchGate", url: "https://www.researchgate.net/", description: "Research Network", tags: ["academic", "network", "papers"] },
        ]
      }
    ]
  },
  {
    id: "mobile",
    name: "Mobile",
    description: "Android, iOS apps, modded APKs, and mobile tools",
    icon: "Smartphone",
    color: "from-lime-500 to-green-500",
    subcategories: [
      {
        name: "Android Apps",
        resources: [
          { id: "revanced", name: "ReVanced", url: "https://revanced.app/", description: "YouTube Without Ads", tags: ["youtube", "adblock", "android"], isFeatured: true },
          { id: "newpipe", name: "NewPipe", url: "https://newpipe.net/", description: "Lightweight YouTube Client", tags: ["youtube", "privacy", "android"], isFeatured: true },
          { id: "tachiyomij2k", name: "TachiyomiJ2K", url: "https://tachiyomi.org/", description: "Manga Reader App", tags: ["manga", "reader", "android"] },
          { id: "fdroid", name: "F-Droid", url: "https://f-droid.org/", description: "FOSS App Store", tags: ["appstore", "foss", "android"], isFeatured: true },
          { id: "aurora", name: "Aurora Store", url: "https://auroraoss.com/", description: "Anonymous Play Store Access", tags: ["appstore", "privacy", "android"] },
          { id: "obtainium", name: "Obtainium", url: "https://github.com/ImranR98/Obtainium", description: "Get App Updates Directly", tags: ["updates", "github", "android"] },
          { id: "lucky-patcher", name: "Lucky Patcher", url: "https://www.luckypatchers.com/", description: "App Modifier", tags: ["modding", "patches", "android"] },
        ]
      },
      {
        name: "Modded APKs",
        resources: [
          { id: "mobilism-apk", name: "Mobilism", url: "https://forum.mobilism.org/", description: "Modded Apps Forum", tags: ["modded", "forum", "android"], isFeatured: true },
          { id: "liteapks", name: "LiteAPKs", url: "https://liteapks.com/", description: "Modded APKs", tags: ["modded", "apk", "android"] },
          { id: "modyolo", name: "MODYOLO", url: "https://modyolo.com/", description: "Modded Games & Apps", tags: ["modded", "games", "android"] },
          { id: "apkmirror", name: "APKMirror", url: "https://www.apkmirror.com/", description: "APK Download Site", tags: ["apk", "official", "android"], isFeatured: true },
          { id: "apkpure", name: "APKPure", url: "https://apkpure.com/", description: "APK Download Site", tags: ["apk", "android"] },
        ]
      },
      {
        name: "iOS Apps",
        resources: [
          { id: "altstore", name: "AltStore", url: "https://altstore.io/", description: "iOS Sideloading", tags: ["sideload", "ios"], isFeatured: true },
          { id: "sideloadly", name: "Sideloadly", url: "https://sideloadly.io/", description: "iOS Sideloading Tool", tags: ["sideload", "ios"] },
          { id: "appdb", name: "AppDB", url: "https://appdb.to/", description: "iOS Apps & Games", tags: ["apps", "games", "ios"] },
          { id: "scarlet", name: "Scarlet", url: "https://usescarlet.com/", description: "iOS App Installer", tags: ["installer", "ios"] },
        ]
      },
      {
        name: "Mobile Streaming",
        resources: [
          { id: "cloudstream", name: "CloudStream", url: "https://cloudstream.on.fleek.co/", description: "Movies & TV Streaming App", tags: ["streaming", "movies", "android"], isFeatured: true },
          { id: "stremio-mobile", name: "Stremio", url: "https://www.stremio.com/", description: "Streaming App with Addons", tags: ["streaming", "addons", "android"] },
          { id: "aniyomi", name: "Aniyomi", url: "https://aniyomi.org/", description: "Anime & Manga App", tags: ["anime", "manga", "android"], isFeatured: true },
          { id: "flixclusive", name: "Flixclusive", url: "https://github.com/rhenwinch/Flixclusive", description: "Movies & TV App", tags: ["streaming", "movies", "android"] },
        ]
      },
      {
        name: "Mobile Tools",
        resources: [
          { id: "termux", name: "Termux", url: "https://termux.dev/", description: "Linux Terminal for Android", tags: ["terminal", "linux", "android"], isFeatured: true },
          { id: "acode", name: "Acode", url: "https://acode.app/", description: "Code Editor for Android", tags: ["editor", "coding", "android"] },
          { id: "tasker", name: "Tasker", url: "https://tasker.joaoapps.com/", description: "Automation App", tags: ["automation", "android"] },
          { id: "shizuku", name: "Shizuku", url: "https://shizuku.rikka.app/", description: "Use System APIs", tags: ["system", "adb", "android"] },
        ]
      }
    ]
  },
  {
    id: "tools",
    name: "Tools & Utilities",
    description: "Browser extensions, userscripts, download managers, and utilities",
    icon: "Settings",
    color: "from-slate-500 to-zinc-500",
    subcategories: [
      {
        name: "Browser Extensions",
        resources: [
          { id: "ublock", name: "uBlock Origin", url: "https://ublockorigin.com/", description: "Best Ad Blocker", tags: ["adblock", "privacy", "extension"], isFeatured: true },
          { id: "sponsorblock", name: "SponsorBlock", url: "https://sponsor.ajay.app/", description: "Skip YouTube Sponsors", tags: ["youtube", "extension"], isFeatured: true },
          { id: "violentmonkey", name: "Violentmonkey", url: "https://violentmonkey.github.io/", description: "Userscript Manager", tags: ["userscripts", "extension"] },
          { id: "tampermonkey", name: "Tampermonkey", url: "https://www.tampermonkey.net/", description: "Userscript Manager", tags: ["userscripts", "extension"], isFeatured: true },
          { id: "bypass-paywalls", name: "Bypass Paywalls Clean", url: "https://github.com/bpc-clone/bpc_updates", description: "Bypass Article Paywalls", tags: ["paywall", "news", "extension"] },
          { id: "decentraleyes", name: "Decentraleyes", url: "https://decentraleyes.org/", description: "Local CDN Emulation", tags: ["privacy", "extension"] },
          { id: "privacy-badger", name: "Privacy Badger", url: "https://privacybadger.org/", description: "Tracker Blocker", tags: ["privacy", "tracker", "extension"] },
        ]
      },
      {
        name: "Userscripts",
        resources: [
          { id: "greasy-fork", name: "Greasy Fork", url: "https://greasyfork.org/", description: "Userscript Repository", tags: ["userscripts", "repository"], isFeatured: true },
          { id: "openuserjs", name: "OpenUserJS", url: "https://openuserjs.org/", description: "Userscript Repository", tags: ["userscripts", "repository"] },
          { id: "adsbypasser", name: "AdsBypasser", url: "https://adsbypasser.github.io/", description: "Skip Link Shorteners", tags: ["adblock", "userscript"] },
          { id: "fastforward", name: "FastForward", url: "https://fastforward.team/", description: "Skip Link Shorteners", tags: ["link", "bypass", "extension"], isFeatured: true },
        ]
      },
      {
        name: "Download Managers",
        resources: [
          { id: "jdownloader", name: "JDownloader", url: "https://jdownloader.org/", description: "Best Download Manager", tags: ["download", "manager"], isFeatured: true },
          { id: "idm", name: "Internet Download Manager", url: "https://www.internetdownloadmanager.com/", description: "Windows Download Manager", tags: ["download", "windows"] },
          { id: "xdm", name: "Xtreme Download Manager", url: "https://xtremedownloadmanager.com/", description: "Cross-Platform Manager", tags: ["download", "opensource"] },
          { id: "motrix", name: "Motrix", url: "https://motrix.app/", description: "Full-Featured Manager", tags: ["download", "opensource"] },
          { id: "free-download-manager", name: "Free Download Manager", url: "https://www.freedownloadmanager.org/", description: "Download Accelerator", tags: ["download", "free"] },
        ]
      },
      {
        name: "Activation Tools",
        resources: [
          { id: "massgrave", name: "Microsoft Activation Scripts", url: "https://massgrave.dev/", description: "Windows & Office Activation", tags: ["windows", "activation"], isFeatured: true },
          { id: "kms", name: "KMS_VL_ALL_AIO", url: "https://github.com/abbodi1406/KMS_VL_ALL_AIO", description: "Windows KMS Activator", tags: ["windows", "kms"] },
        ]
      },
      {
        name: "Media Tools",
        resources: [
          { id: "handbrake", name: "HandBrake", url: "https://handbrake.fr/", description: "Video Transcoder", tags: ["video", "converter"], isFeatured: true },
          { id: "ffmpeg", name: "FFmpeg", url: "https://ffmpeg.org/", description: "Media Framework", tags: ["video", "audio", "cli"], isFeatured: true },
          { id: "obs", name: "OBS Studio", url: "https://obsproject.com/", description: "Screen Recording & Streaming", tags: ["recording", "streaming"] },
          { id: "vlc", name: "VLC Media Player", url: "https://www.videolan.org/vlc/", description: "Universal Media Player", tags: ["player", "video", "audio"], isFeatured: true },
          { id: "mpv", name: "mpv", url: "https://mpv.io/", description: "Minimal Media Player", tags: ["player", "minimal"] },
          { id: "staxrip", name: "StaxRip", url: "https://github.com/staxrip/staxrip", description: "Video Encoding GUI", tags: ["video", "encoding"] },
        ]
      },
      {
        name: "System Utilities",
        resources: [
          { id: "bleachbit", name: "BleachBit", url: "https://www.bleachbit.org/", description: "System Cleaner", tags: ["cleaner", "privacy"], isFeatured: true },
          { id: "everything", name: "Everything", url: "https://www.voidtools.com/", description: "Instant File Search", tags: ["search", "files", "windows"], isFeatured: true },
          { id: "7zip", name: "7-Zip", url: "https://www.7-zip.org/", description: "File Archiver", tags: ["archive", "compression"] },
          { id: "revo", name: "Revo Uninstaller", url: "https://www.revouninstaller.com/", description: "Complete Uninstaller", tags: ["uninstaller", "windows"] },
          { id: "wiztree", name: "WizTree", url: "https://diskanalyzer.com/", description: "Disk Space Analyzer", tags: ["disk", "analyzer", "windows"] },
          { id: "bulk-crap", name: "Bulk Crap Uninstaller", url: "https://www.bcuninstaller.com/", description: "Bulk Uninstaller", tags: ["uninstaller", "windows"] },
        ]
      }
    ]
  },
  {
    id: "anime",
    name: "Anime",
    description: "Anime streaming, downloads, tracking, and community resources",
    icon: "Tv",
    color: "from-fuchsia-500 to-pink-500",
    subcategories: [
      {
        name: "Anime Streaming",
        resources: [
          { id: "aniwave-full", name: "AniWave", url: "https://aniwave.live/", description: "Sub / Dub / Auto-Next", tags: ["anime", "streaming", "sub", "dub"], isFeatured: true },
          { id: "hianime-full", name: "HiAnime", url: "https://hianime.nz/", description: "Sub / Dub / Auto-Next", tags: ["anime", "streaming", "sub", "dub"], isFeatured: true },
          { id: "animekai", name: "AnimeKai", url: "https://animekai.to/", description: "HD Anime Streaming", tags: ["anime", "streaming", "hd"] },
          { id: "gogoanime", name: "GoGoAnime", url: "https://anitaku.pe/", description: "Classic Anime Site", tags: ["anime", "streaming"] },
          { id: "animesuge", name: "AnimeSuge", url: "https://animesuge.to/", description: "Anime Streaming", tags: ["anime", "streaming"] },
          { id: "aniwatch", name: "AniWatch", url: "https://aniwatch.to/", description: "HD Anime Streaming", tags: ["anime", "streaming", "hd"] },
        ]
      },
      {
        name: "Anime Downloads",
        resources: [
          { id: "nyaa", name: "Nyaa.si", url: "https://nyaa.si/", description: "Anime Torrents", tags: ["anime", "torrent", "download"], isFeatured: true },
          { id: "subsplease", name: "SubsPlease", url: "https://subsplease.org/", description: "Fast Anime Releases", tags: ["anime", "torrent", "fast"] },
          { id: "erai-raws", name: "Erai-raws", url: "https://www.erai-raws.info/", description: "Multi-Sub Anime", tags: ["anime", "torrent", "sub"] },
          { id: "judas", name: "Judas", url: "https://rentry.org/judas-ddl", description: "Small Anime Encodes", tags: ["anime", "download", "small"] },
          { id: "anidl", name: "AniDL", url: "https://anidl.org/", description: "Anime Direct Downloads", tags: ["anime", "download", "ddl"] },
        ]
      },
      {
        name: "Anime Tracking",
        resources: [
          { id: "myanimelist", name: "MyAnimeList", url: "https://myanimelist.net/", description: "Anime Database & Tracking", tags: ["anime", "database", "tracking"], isFeatured: true },
          { id: "anilist", name: "AniList", url: "https://anilist.co/", description: "Modern Anime Tracker", tags: ["anime", "tracking", "social"], isFeatured: true },
          { id: "anidb", name: "AniDB", url: "https://anidb.net/", description: "Comprehensive Anime Database", tags: ["anime", "database"] },
          { id: "kitsu", name: "Kitsu", url: "https://kitsu.app/", description: "Anime & Manga Community", tags: ["anime", "manga", "social"] },
          { id: "simkl", name: "Simkl", url: "https://simkl.com/", description: "TV & Anime Tracker", tags: ["anime", "tv", "tracking"] },
        ]
      },
      {
        name: "Anime Apps",
        resources: [
          { id: "aniyomi-app", name: "Aniyomi", url: "https://aniyomi.org/", description: "Anime & Manga Android App", tags: ["anime", "manga", "android"], isFeatured: true },
          { id: "saikou", name: "Saikou", url: "https://saikou.app/", description: "Anime Android App", tags: ["anime", "android"] },
          { id: "miru", name: "Miru", url: "https://miru.watch/", description: "Cross-Platform Anime App", tags: ["anime", "desktop", "app"], isFeatured: true },
          { id: "ani-cli", name: "ani-cli", url: "https://github.com/pystardust/ani-cli", description: "CLI Anime Watcher", tags: ["anime", "cli", "terminal"] },
        ]
      },
      {
        name: "Anime Resources",
        resources: [
          { id: "wotaku", name: "Wotaku", url: "https://wotaku.wiki/", description: "Japanese Media Wiki", tags: ["anime", "manga", "wiki"], isFeatured: true },
          { id: "theindex", name: "The Index", url: "https://theindex.moe/", description: "Anime Resource Index", tags: ["anime", "index", "resources"] },
          { id: "seadex", name: "SeaDex", url: "https://releases.moe/", description: "Best Release Comparisons", tags: ["anime", "quality", "releases"] },
          { id: "chiaki", name: "Chiaki", url: "https://chiaki.site/", description: "Anime Schedule", tags: ["anime", "schedule"] },
        ]
      }
    ]
  }
];

export function searchResources(query: string): Resource[] {
  const lowerQuery = query.toLowerCase();
  const results: Resource[] = [];
  
  for (const category of resourceCategories) {
    for (const subcategory of category.subcategories) {
      for (const resource of subcategory.resources) {
        if (
          resource.name.toLowerCase().includes(lowerQuery) ||
          resource.description.toLowerCase().includes(lowerQuery) ||
          resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        ) {
          results.push(resource);
        }
      }
    }
  }
  
  return results;
}

export function getFeaturedResources(): Resource[] {
  const featured: Resource[] = [];
  
  for (const category of resourceCategories) {
    for (const subcategory of category.subcategories) {
      for (const resource of subcategory.resources) {
        if (resource.isFeatured) {
          featured.push(resource);
        }
      }
    }
  }
  
  return featured;
}
