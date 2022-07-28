package services

import (
	"github.com/micro/micro/v3/service/client"
	"github.com/m3o/m3o/services/address/proto"
	"github.com/m3o/m3o/services/analytics/proto"
	"github.com/m3o/m3o/services/answer/proto"
	"github.com/m3o/m3o/services/app/proto"
	"github.com/m3o/m3o/services/avatar/proto"
	"github.com/m3o/m3o/services/bitcoin/proto"
	"github.com/m3o/m3o/services/cache/proto"
	"github.com/m3o/m3o/services/carbon/proto"
	"github.com/m3o/m3o/services/chat/proto"
	"github.com/m3o/m3o/services/comments/proto"
	"github.com/m3o/m3o/services/contact/proto"
	"github.com/m3o/m3o/services/crypto/proto"
	"github.com/m3o/m3o/services/currency/proto"
	"github.com/m3o/m3o/services/db/proto"
	"github.com/m3o/m3o/services/dns/proto"
	"github.com/m3o/m3o/services/email/proto"
	"github.com/m3o/m3o/services/emoji/proto"
	"github.com/m3o/m3o/services/evchargers/proto"
	"github.com/m3o/m3o/services/event/proto"
	"github.com/m3o/m3o/services/file/proto"
	"github.com/m3o/m3o/services/forex/proto"
	"github.com/m3o/m3o/services/function/proto"
	"github.com/m3o/m3o/services/geocoding/proto"
	"github.com/m3o/m3o/services/gifs/proto"
	"github.com/m3o/m3o/services/github/proto"
	"github.com/m3o/m3o/services/google/proto"
	"github.com/m3o/m3o/services/helloworld/proto"
	"github.com/m3o/m3o/services/holidays/proto"
	"github.com/m3o/m3o/services/id/proto"
	"github.com/m3o/m3o/services/image/proto"
	"github.com/m3o/m3o/services/ip/proto"
	"github.com/m3o/m3o/services/joke/proto"
	"github.com/m3o/m3o/services/lists/proto"
	"github.com/m3o/m3o/services/location/proto"
	"github.com/m3o/m3o/services/memegen/proto"
	"github.com/m3o/m3o/services/minecraft/proto"
	"github.com/m3o/m3o/services/movie/proto"
	"github.com/m3o/m3o/services/mq/proto"
	"github.com/m3o/m3o/services/news/proto"
	"github.com/m3o/m3o/services/nft/proto"
	"github.com/m3o/m3o/services/notes/proto"
	"github.com/m3o/m3o/services/otp/proto"
	"github.com/m3o/m3o/services/password/proto"
	"github.com/m3o/m3o/services/ping/proto"
	"github.com/m3o/m3o/services/place/proto"
	"github.com/m3o/m3o/services/postcode/proto"
	"github.com/m3o/m3o/services/prayer/proto"
	"github.com/m3o/m3o/services/price/proto"
	"github.com/m3o/m3o/services/qr/proto"
	"github.com/m3o/m3o/services/quran/proto"
	"github.com/m3o/m3o/services/routing/proto"
	"github.com/m3o/m3o/services/rss/proto"
	"github.com/m3o/m3o/services/search/proto"
	"github.com/m3o/m3o/services/sentiment/proto"
	"github.com/m3o/m3o/services/sms/proto"
	"github.com/m3o/m3o/services/space/proto"
	"github.com/m3o/m3o/services/spam/proto"
	"github.com/m3o/m3o/services/stock/proto"
	"github.com/m3o/m3o/services/stream/proto"
	"github.com/m3o/m3o/services/sunnah/proto"
	"github.com/m3o/m3o/services/thumbnail/proto"
	"github.com/m3o/m3o/services/time/proto"
	"github.com/m3o/m3o/services/translate/proto"
	"github.com/m3o/m3o/services/tunnel/proto"
	"github.com/m3o/m3o/services/twitter/proto"
	"github.com/m3o/m3o/services/url/proto"
	"github.com/m3o/m3o/services/user/proto"
	"github.com/m3o/m3o/services/vehicle/proto"
	"github.com/m3o/m3o/services/wallet/proto"
	"github.com/m3o/m3o/services/weather/proto"
	"github.com/m3o/m3o/services/wordle/proto"
	"github.com/m3o/m3o/services/youtube/proto"
)

type Client struct {
	Address    address.AddressService
	Analytics  analytics.AnalyticsService
	Answer     answer.AnswerService
	App        app.AppService
	Avatar     avatar.AvatarService
	Bitcoin    bitcoin.BitcoinService
	Cache      cache.CacheService
	Carbon     carbon.CarbonService
	Chat       chat.ChatService
	Comments   comments.CommentsService
	Contact    contact.ContactService
	Crypto     crypto.CryptoService
	Currency   currency.CurrencyService
	Db         db.DbService
	Dns        dns.DnsService
	Email      email.EmailService
	Emoji      emoji.EmojiService
	Evchargers evchargers.EvchargersService
	Event      event.EventService
	File       file.FileService
	Forex      forex.ForexService
	Function   function.FunctionService
	Geocoding  geocoding.GeocodingService
	Gifs       gifs.GifsService
	Github     github.GithubService
	Google     google.GoogleService
	Helloworld helloworld.HelloworldService
	Holidays   holidays.HolidaysService
	Id         id.IdService
	Image      image.ImageService
	Ip         ip.IpService
	Joke       joke.JokeService
	Lists      lists.ListsService
	Location   location.LocationService
	Memegen    memegen.MemegenService
	Minecraft  minecraft.MinecraftService
	Movie      movie.MovieService
	Mq         mq.MqService
	News       news.NewsService
	Nft        nft.NftService
	Notes      notes.NotesService
	Otp        otp.OtpService
	Password   password.PasswordService
	Ping       ping.PingService
	Place      place.PlaceService
	Postcode   postcode.PostcodeService
	Prayer     prayer.PrayerService
	Price      price.PriceService
	Qr         qr.QrService
	Quran      quran.QuranService
	Routing    routing.RoutingService
	Rss        rss.RssService
	Search     search.SearchService
	Sentiment  sentiment.SentimentService
	Sms        sms.SmsService
	Space      space.SpaceService
	Spam       spam.SpamService
	Stock      stock.StockService
	Stream     stream.StreamService
	Sunnah     sunnah.SunnahService
	Thumbnail  thumbnail.ThumbnailService
	Time       time.TimeService
	Translate  translate.TranslateService
	Tunnel     tunnel.TunnelService
	Twitter    twitter.TwitterService
	Url        url.UrlService
	User       user.UserService
	Vehicle    vehicle.VehicleService
	Wallet     wallet.WalletService
	Weather    weather.WeatherService
	Wordle     wordle.WordleService
	Youtube    youtube.YoutubeService
}

func NewClient(c client.Client) *Client {
	return &Client{
		Address:    address.NewAddressService("address", c),
		Analytics:  analytics.NewAnalyticsService("analytics", c),
		Answer:     answer.NewAnswerService("answer", c),
		App:        app.NewAppService("app", c),
		Avatar:     avatar.NewAvatarService("avatar", c),
		Bitcoin:    bitcoin.NewBitcoinService("bitcoin", c),
		Cache:      cache.NewCacheService("cache", c),
		Carbon:     carbon.NewCarbonService("carbon", c),
		Chat:       chat.NewChatService("chat", c),
		Comments:   comments.NewCommentsService("comments", c),
		Contact:    contact.NewContactService("contact", c),
		Crypto:     crypto.NewCryptoService("crypto", c),
		Currency:   currency.NewCurrencyService("currency", c),
		Db:         db.NewDbService("db", c),
		Dns:        dns.NewDnsService("dns", c),
		Email:      email.NewEmailService("email", c),
		Emoji:      emoji.NewEmojiService("emoji", c),
		Evchargers: evchargers.NewEvchargersService("evchargers", c),
		Event:      event.NewEventService("event", c),
		File:       file.NewFileService("file", c),
		Forex:      forex.NewForexService("forex", c),
		Function:   function.NewFunctionService("function", c),
		Geocoding:  geocoding.NewGeocodingService("geocoding", c),
		Gifs:       gifs.NewGifsService("gifs", c),
		Github:     github.NewGithubService("github", c),
		Google:     google.NewGoogleService("google", c),
		Helloworld: helloworld.NewHelloworldService("helloworld", c),
		Holidays:   holidays.NewHolidaysService("holidays", c),
		Id:         id.NewIdService("id", c),
		Image:      image.NewImageService("image", c),
		Ip:         ip.NewIpService("ip", c),
		Joke:       joke.NewJokeService("joke", c),
		Lists:      lists.NewListsService("lists", c),
		Location:   location.NewLocationService("location", c),
		Memegen:    memegen.NewMemegenService("memegen", c),
		Minecraft:  minecraft.NewMinecraftService("minecraft", c),
		Movie:      movie.NewMovieService("movie", c),
		Mq:         mq.NewMqService("mq", c),
		News:       news.NewNewsService("news", c),
		Nft:        nft.NewNftService("nft", c),
		Notes:      notes.NewNotesService("notes", c),
		Otp:        otp.NewOtpService("otp", c),
		Password:   password.NewPasswordService("password", c),
		Ping:       ping.NewPingService("ping", c),
		Place:      place.NewPlaceService("place", c),
		Postcode:   postcode.NewPostcodeService("postcode", c),
		Prayer:     prayer.NewPrayerService("prayer", c),
		Price:      price.NewPriceService("price", c),
		Qr:         qr.NewQrService("qr", c),
		Quran:      quran.NewQuranService("quran", c),
		Routing:    routing.NewRoutingService("routing", c),
		Rss:        rss.NewRssService("rss", c),
		Search:     search.NewSearchService("search", c),
		Sentiment:  sentiment.NewSentimentService("sentiment", c),
		Sms:        sms.NewSmsService("sms", c),
		Space:      space.NewSpaceService("space", c),
		Spam:       spam.NewSpamService("spam", c),
		Stock:      stock.NewStockService("stock", c),
		Stream:     stream.NewStreamService("stream", c),
		Sunnah:     sunnah.NewSunnahService("sunnah", c),
		Thumbnail:  thumbnail.NewThumbnailService("thumbnail", c),
		Time:       time.NewTimeService("time", c),
		Translate:  translate.NewTranslateService("translate", c),
		Tunnel:     tunnel.NewTunnelService("tunnel", c),
		Twitter:    twitter.NewTwitterService("twitter", c),
		Url:        url.NewUrlService("url", c),
		User:       user.NewUserService("user", c),
		Vehicle:    vehicle.NewVehicleService("vehicle", c),
		Wallet:     wallet.NewWalletService("wallet", c),
		Weather:    weather.NewWeatherService("weather", c),
		Wordle:     wordle.NewWordleService("wordle", c),
		Youtube:    youtube.NewYoutubeService("youtube", c),
	}
}
