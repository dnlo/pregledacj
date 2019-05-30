package feeds

import (
	"encoding/json"
	"github.com/mmcdole/gofeed"
	"log"
	"context"
//	"os"
	"sync"
	"strings"
	"net/http"
	"time"
	"cloud.google.com/go/storage"

)

var wg = sync.WaitGroup{}

type Item struct {
	Title       string     `json:"title"`
	Link        string     `json:"link"`
	Date        *time.Time `json:"date"`
}

func CollectFeeds(_ http.ResponseWriter, _ *http.Request) {
	ctx := context.Background()

        // Creates a client.
        client, err := storage.NewClient(ctx)
        if err != nil {
                log.Fatalf("Failed to create client: %v", err)
        }

	// Sets the name for the new bucket.
        bucketName := "pregledacj-feeds"

        // Creates a Bucket instance.
        bucket := client.Bucket(bucketName)

	for k, v := range feedList {
		wg.Add(1)
		go func(v, k string) {
			fp := gofeed.NewParser()

			feed, err := fp.ParseURL(v)
			if err != nil {
				log.Println(err)
				wg.Done()
				return
			}
			ob := bucket.Object(k + ".json")
			file := ob.NewWriter(ctx)

			enc := json.NewEncoder(file)
			counter := 0
			var its []Item
			for _, f := range feed.Items {
				if counter == 10 {
					break
				}
				title := strings.Replace(f.Title, "\u0026quot;", "", -1)
				title = strings.Replace(f.Title, "\u0026#039;", "'", -1)
				
				its = append(its, Item{
					title,
					f.Link,
					f.PublishedParsed,
				})
				counter += 1
			}
			withKey := make(map[string][]Item)
			withKey[k] = its
			
			err = enc.Encode(withKey)
			if err != nil {
				log.Println(err)
			}

			wg.Done()
			file.Close()
		}(v, k)
	}

	wg.Wait()

}

var feedList = map[string]string{
	"Blic":     "https://www.blic.rs/rss/danasnje-vesti",
	"Novosti":  "http://www.novosti.rs/rss/57%7C25%7C49%7C56%7C33%7C19%7C34%7C20%7C18%7C32%7C58%7C45%7C16%7C31%7C50%7C5%7C1%7C3%7C26%7C52%7C2%7C6%7C55%7C35%7C4%7C9%7C8%7C7%7C51%7C12%7C47%7C46%7C30%7C53%7C14%7C13%7C11%7C15%7C10%7C48%7C36%7C54-Sve%20vesti",
	"RTS":      "http://www.rts.rs/page/stories/sr/rss.html",
	"N1":       "http://rs.n1info.com/rss/250/Najnovije",
	"Politika": "http://www.politika.rs/rss/",
	"Danas":    "https://www.danas.rs/feed/",
	"Kurir": "https://www.kurir.rs/rss",
	"Informer": "https://informer.rs/rss/danasnje-vesti",
	"Alo": "https://www.alo.rs/rss/vesti",
	"Telegraf": "https://www.telegraf.rs/rss",
	"Beta": "http://feeds.feedburner.com/betavesti",
	"Tanjug": "http://www.tanjug.rs/Rsslat.aspx",
	"Espreso": "https://www.espreso.rs/rss",
	"Press": "http://www.pressonline.rs/info/rss.html",
	"NIN": "http://www.nin.co.rs/misc/rss.php?feed=RSS2.0",
	"Aljazeera": "http://balkans.aljazeera.net/mobile/articles",
	"Vreme": "https://www.vreme.com/rss/novosti-rss.xml",
	"JuzneVesti": "https://feeds.feedburner.com/juznevesti",
	"B92": "http://www.b92.net/info/rss/vesti.xml",
}
