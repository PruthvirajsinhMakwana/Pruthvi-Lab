// FMHY Resources Data - Curated from freemediaheckyeah.net

export type ResourceCategory = 
  | "streaming"
  | "gaming"
  | "downloading"
  | "torrenting"
  | "educational"
  | "gaming-tools"
  | "software"
  | "privacy";

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
