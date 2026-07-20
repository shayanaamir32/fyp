"use client"

import { useEffect, useState } from "react"
import { MessageCircle, MapPin, Phone, Search, Info, Star } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { getAllVendors } from "@/services/vendor"

interface Vendor {
  id: string
  businessName: string
  address: string
  phone: string
  rating: number
  reviewCount: number
  specialties: string[]
  imageUrl: string
  description: string
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - Math.ceil(rating)

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative w-5 h-5">
          <Star className="absolute w-5 h-5 text-yellow-400" />
          <div className="absolute w-[50%] overflow-hidden">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  )
}

function ContactVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchVendors() {
      try {
        const data = await getAllVendors()
        const formatted = data.map((v: any) => ({
          id: v._id,
          businessName: v.businessName,
          address: v.address,
          phone: v.phoneNumber,
          rating: v.averageRating || 0,
          reviewCount: v.reviewCount || 0,
          specialties: v.specialties || [], // assuming backend adds this or add default
          imageUrl: v.imageUrl || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBCwMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAAAQMEBQYCB//EAEcQAAEDAgQDBAYFCAcJAAAAAAEAAgMEEQUSITEGE0EiUWFxFDKBkbHRFSNCocEWMzRScpLS8CRUYoKEk+EHQ0RFU1VzlML/xAAZAQEAAwEBAAAAAAAAAAAAAAAAAgMEAQX/xAAmEQADAAICAgICAwADAAAAAAAAAQIDEQQhEjETQSIyBRRRIySR/9oADAMBAAIRAxEAPwD3FCEIAQhCAEIQgBCLoQAhISBuQFyHsOzgfagO0JA4HYhKgBCEIAQhCAEIQgBCEIAQhCAEIQgBCFySBuQgOkLnM3vCW4QCoQhACEIQAhCEAIQhACEIQAhCQoAPeq2pxEMcWRtuB1KTH69lDSAueGufoCT06qjZiUD7Bjr38FOUmXY8e+2WFZVuqWsc0epfM0HdMNeC0G6bkuW5mxm4FwWqugxIF7mPbZ19lDPmnEvRpnF10W7ZS145biDfcKzZibA4NINu9Z+GobINQ+39kXUhlRT7B22ljurJaySqIVjTNOx7XsDmm4K7VThdT2+USCDq3XZWyg1oy3Pi9AhCFwiCEIQAhCEAIQhAIm5pmQsLnmwCWaRsUb5HkBrRdZ6TFY6l9mvDjewaLFSmdk4h0WgxEF+jRl7wdVDknM0khLrgOO56XUCqkZBGZcksdu4GyjQ4nFI24+0PeVXlzThetGqcKXZaB7SbAJymqJYZ8xc3k2PYG6rWSMYLvL2t7rKXC+I+oR5XWjqkdqF6LynqmTGw0cOifVHTyZaqKx3dYq8CrqdGS58WKhCFEgCEIQAhCEAIQkzBAKkJsi64keGsLugF0BV49U00UA5tPHUTMBfEx4Bse9VcOIuqWgyPBcR9nQKrnqzPVSzSE9snfuVMKz0Soexslww9D0SMiT7LOHayVUm0D98zvJRZhSOqImSxRukeTluNTb4qjhxbmuAzEk6ADqoHF8lTR49w/HED6VI6+S/67g233qeSoS2zZW8fs2jWNAGTsW2y6XUetp4auN0c7SCRbmMNnDyP4bKFHiJ7TX9h7CWuafskHZK+r5gAYHFztgBclT68TqlkLAo8SwrEHmqq/S6djvq847dvNegUtQyqhbLEbtPfuFimSiRgLSL6g+B7j3K44amPpEsN+yW5rePf7VR1s8b5q+ZyzRpVzcJb6rpoFQhCAEJCbIuEAqEl0XQEDG3xNw+QTtzsf2ct97qnoY4Y4gKeNkTbaZRqneLqg+jthYQMv1hJWbhxgAjtZR3KcUjXx15S9Gjm5QhPOs5hIFiN7mwTUWHUjATHCGuvcEdCuxQPqsOFVM0ukYOZBGSR7SOqrosUa4XD7qepp9onLddIsg9jhklAPmsbxHRYph1ZHNg9XKKeU6xPObK7uHgr6Wra912runnZK9sUru0RdmYb+Sjfor5PlGNtEXh2qxY8uXE447MIIIv2vktxSVDKmMSM07x3LNEa2/FScJnMdfEwEnmXDh7L/gqtv7PLjkXVao0iEl0XXTUKhJdFx/IQCoQhACqeI6qqpMP5lIWNk5jGku6NJtceKtlneN5BHgrZXU7pgyeM9gElnaHasNTZGSjXktmRPFU9VXsohVVjZXy8rtwOjYTrch1tdlXRY1iNRU8gNq2gk9p0rg0Abk+CoIsRqIeI4Z66rq30cU7nhjgSGCxA09qdixDCqSpeWV1ZVtnY6OUiDKIweovuVnpTT9nrRinWki7jxakqGvNFVR1AikYycNv2A52UHyuuXZ4Y8RlFK5vIdleNfrfLwWdZDSU9BWU2D1EtZU1eQSSuiyBrWm4Ab33vcq7lxpgqaWKsBjpX0zvSyWEEyafI7eC74w/ZGcUxX4rseiqaamEk88c0ToqeOd3KaXObnJAb56D3pmSvwurkOKVU1RG2lLGtnqmva5pJuN/iqjDsXc6qxeSor3UMtW5nInMWcMDSdLeVh0U2nrZIIqrtHGnSSRlrpIHBrmje3cR0XVMMnkjv8ibVV89NVyl1JLK86mVri4SDoQeqejxIQwQ1VVIKLmk8sPLsx6dNlR4rVU9TUuljqKrM4DNG7Ldh/VHgEuHVlJTSwOZjmItibYyYfJCH8w9QHEaAquWnTTJOH470Wr8Ylhpoa6OCWR9TmLgHEk2NlYy4nLSyVD56g00FMxjpai5aLuGjR3lZvEsSxClwyD6HIpBZ7ntkg9W7rgAn8FxXYnQYs+sppquohgllZPHO2DMARG1jmkb2uCfarNQipYIp7Umsp+KakQOq48QkkoGwPm57RfRnrCxG62nCuIyYnhwqpJBIx7rxOtYlpF9QvJKLEYKaP0PDGzmGKncyKR0QvLK4i5tbbwK9L/2dvlfgz3TslEvOOZ8oIL/Z0Fu7RSVT6Rn5MKZ9GrSoQrDCcvNmk9wusO/jInFPo9tRDHUudZkTozr138gtvKLsIG5Gi8arq2rpeLojPNOzDo3HOHxnKHZSN7d5R612aeNE035Gkj42rJqyopmhrTTlwke5lmgA2vf2KSeI8SfTuqIponxCEytLLHMBvbxWH9Kw6RuJ00mKhzq1znMk5Lg2LtEgG++h8F1heKU1HX4dQU87JKSKnkjnn2BcdRp3XH3qE+P2za8Er6NPX11TXSthrfWlhz5gQLNHQ+KqmvweOvFD6aDXR2+pc7tE7qHi+OtdhETo3sM75g1wB1DA+5+5dzVM7scbVCtwk4ZzGnMLc4i3U+B+5ccY2zsYvDuVou6/iOtoqaOZ1bM6nccrZIS0gHu20VbRV8ddK98HNcL3e4uaG3KiYhVwSYU6PDamOFomLpYHtLi8nqDfZRcMkrDRkxVuFTgy/WU9U0gAD7QJ+Sh0r1vonMJTtIvaiqjgpJqqR7gyGQMfkcCbm23fuE7PiU9XHSNklmeJAXxANaCwDrfoFV4pidJSYRUPo6eGpjdUNbyQbNzZdSPC67mqoq/D/RY5YaeqqKMGNpdZo7236KdRO/ZGoVLVIvmYlLHFACGvbKXNbIHBwBAubkeSYnxaanMU9O8DOC6OVmoPQ6+1Z/h2JmE01NhtRLD6S98s742SXawZbAX93tJTGHV01RGYG00FPTQNIbExxcRrvc63UMjSje+yhcPEq34ml/KnFP6yfbb5I/KnFelT8PkqVrXHZhPkE8ynnf6kR9oWT5H/AKXfHj/wtPypxexIqTp/ZCPyqxcb1Nj/AOMKCzDKt5sAGq7j4LxB7Gv9LhbmF7do2Upq69FdLDPtI9BQhC9A8wFy/stLu4bLpcyAmNwG5CMHlHEtG2omqaiNwvK8uy22TtDT0HJjghc0OygnxKdxUSh0kTo3hzSRo24WbDqilfcsOh9YLzep2e3wbWtN6PReFKOlp4J5IomNkfIQ9wbqbJeLoaOSkgNRHGfrR2i3Ue1ZHAeLm0XNhr2uAc/M1zWk6HyTfFPFcOIwRQUjH5GuLnPcLX7hqvRUeWLpGB5FPK3T62WDqOiqYC5uSSIes1wW5o444aaKOFrGRhoytaLABeOR4w+CKRsZN3DULZYbxjTmjYZw5r2NGYBpKpxNY/36NPPpZNfG/I7xumoIMZqCQyJ8ga7si1zb/ROYNQ0sOMRSlkb3OjdkeRexWOxnHH4nic1SI8kJAEYcdbDvXeHcQT0dVTSA544nOzAnWxFtFQss+ezU1/1/FPvR6vW00FZRy09RGySNzSCHC6wtNS0RDYYywOt6pGg8FMk42oxTnKHOkIsARYX81n48OxIS8yFoma7tBzXAEX8CrORlh0kZ/wCP3KryejQ4TR08UzJQ1t4pRs3uK9BZ2mtcOoWEwuGaGBkcocZHG7yQbAlbqIFsbWnoAu8dJb0YuVXlfQ4hCS60mUDsszxuYJKKClqb5JZQSR3BaUnZY/8A2h0M9TS081MQXRk3bfcHuVeX9GX8ZS8q8n0VVLhdBWSxwwRx5HHtWaLgLTwYVg+EUT3Q0NNG1rbuIjFz43WFwSepw2tE1TE5seUtIvf2qbxBxZSy4dLS0shfO/KD2T2RfVQwtNPXs28u95FO/wAQqsOw2tqXVbYadkr23IEY26K5wPgzBYAysqaGGWqIuC9twzwAXn0WJGOz2OJtsPivQKfirDn0/NdVMYA25Dnaj2KWKW91a0S52RTM48VEfiXC8JrZRTCmhY6KxcWjL7NFVUvBmHYnVNiljayJgzudGbG3TVVGI4qaqvmqY3HI91x5LQcJY7AOfFLI1rwWht+o/kqqbm77L7l4eNuXtsvJ+GOHKGgcHYdFlAtmJJJ9t1jX8IYeM7hCHAku7Tyco7loOMMZi+ixDHKHSPeDYG5sFl6LFJZJmjmOcT2ctzp5pnud6RzgY68HdP8A9IDOHKV9W70aNwiabEZuq1uEcP08TeZyQDayZwhto5bb8w3WmoNYisXi6/LZnz5276GosPpmt0jF12KaMGwanmZmuII0PW66cACuUutoo2xtsbRs0XCvqQn0aO/cqaw08Vd0n6NH5LVxZa2U5XsfQhJdbigVcyeofJLdcvcLFGDCVTbvd2+p6qoxKmvTSG91f1MED5Xuyal1zqVVYgxoika0G1tl5ebpGzH7MrPSDM0jctXLKAPcAWlxJ0AFzdTnZXFh5jRpsStBgTKSkgFXNVFrnX9UgD7xdexxs0LElvsy5OPd5W9dGUqMKls6JtNKZQ3NkDCXW8gpYowyic4tyubGbgjXZb972NiE7m3sL5ra5VTY2yGpw+WshmMhyEZSRa3uus3On5pVL6NXGj49pP2YuKlDqWN2X7I19pStpfAq0pIiaOK4+wPxTnI8Fb/HqHh71vZl5tWsukUVXFkazx+YW2w85DqT6jbLM4lAcjDl2OvvC1LGtbC15GtgsXOaXI6RowN1gWywbJc+ufetczVjfJY+JsTXtIj1BBGpWta8OAN7aK3AU3oeukXGYd6M60FZ2s9xX6lOb6dpX2ZUvExDoI43AFjibgqvL+hKf2Rja1v1TnZum11lpqe0zn23Oy11XSsIAjbl8iT8VZYPg9HFI6aKUTzAWfcAtHlos/E383kvSNVx5Y/FfZ53JTnrdp321THL+tDdO7TqvXmGGVz3RGMyM7DnEZi3wKwOO0rhjjs8MbHDcxAhrri97dNF6PJyp4W2Z8eBxaaKlrbta0DofgkNLl2HcfuUxkNpQALDKfgU+6Dw6D4Beb/GxOTI0zTzcjiE0yrdE5u1/ernh8f0B7iAfrLX62UaSE2U7AYz9GvAGvMJAV38lhnGpcrRXwc12qTZoIaan0cIiCdfWVtQwxMjOVhB8TdU9LJNIy7YNBp64VxSc3l9qOw77rGvHR2t77HZCGuDre5dHt7Dok3Oq5c8NILjbVVqvo6dC9wHCyvKT9Gj8ln6ipjiaXyODQO8pyLinDo42sDptBb82VqwPtldy9Lo0JK4c9K4ph5W0oFdJbqo1TVNhifI9+VjRclLIVQcXlv0DVBzntuBYtOoNxZcp6RKFukisGI8wZgYmhxPrHVMS1MLr5pY7nuKyDubf9Pd7GH5pl/MtrWvP9w/Nea15fZ6SxJdmnLqIEnND+8FyaujY5oHLcCbaOGnsWRkc8f8Y/2NPzTuEUv0hicNLJVuDJDZzsuo081yMKT6OXPW0zbyYy+Jpa1/NNtRe2XuBUJ1Q1lNLzZ4Hucw9gbDwVlHwnHNEI5Kt5blaM49c2vubLJ4jSSUGIz0ra55bE7KDl8PNaM85PHtmbB/yvdP0XdEzNSRbjsN2PiU6YLfad71zh9vRomula45BcnrqVKyD9dnvWnhPFOLVFHKnK8n4orK9ha1oDnkEjQnxCvDLAYBHz4w7Y3cLhVWIMGRhzMdZw6+IWbLpDI8x1b2NLiQ0sOgv5rHy5m87cmvi46+HVG7NaGNL+dE7KL5WnU+AWmpq1s8MckT8zHC4P8APVePXlGvp0n7h+a9A4Qc36FiGd0jg92Zzjue/wCCt4/T0R5GJKdmpbL4pwSqA1ycD/FajGTeZf8A0Wc4ixegkb6PFVNNTE61gRoet7q5Emi8n4lMU2O1rnNfGebYiOSw062sqs36l/HhVXZo+e2RtnuzX6hhQ3FXYeMrWfVb6CxWI5UfSaUfulWvD+FVGJzyCHECwQhrrOaSHEna1/NZcKc3tGrNGsbclpQ1ZiqKmSnc8ukfmFut+9PTRxzOMkrbyu9Z2ZSKnhCpfTudHVMhLGuIAGYO66rFc2rBP1kR/ZdZM+O/X0U8RO5267NC6NnpYDTfsn4Loslvo1hFhvcdFWYO+Z9YOc02yGzr3t96vyNtPsj4BT4EL5mm/oc5uYX2V8jX21jH90/NTcCblpSD+uUP02UB2Ktw2JrCzR7iQ4q3+SxpTOnsq4FOvLfRoqKQBj9QO1sVd0jwYr/isHFxBTON3MYT7lZwcQNdH/RmRsd1udlgmmlrRqeFtmomqI4WkyPa0DvVLWY23UU4vro92yppamapcXueXeJ2C5ay7rC8kh6WXYxNlihT7HZJp6k55XOdr6ztvcu2F7W2a6QjwVrh2ASTEPreww/YG581pI6GCNjWNgjsBYdkLbjw67KMmdLpFu5MuCklq5LFoMRDcy6qscwt2J4dNRtk5bpALPtexBvsr10STlI1s6m09o8ydwHiAuBidMf8M7+JR5OBMR/7lTf+u7+JepmDNouTSg7qv4pLv7GT/TyKXgLET/zOmH+Hd/Eu8N4NxCgxCCpdiVM5sbwS3lObcddbr1j0Np+zdcmhbbVi78ckXntlVRxSsjFz2Rub6LB4twpjFRi01aytp5M0hfyshAsdu1cr0wYRTh2fkR5u8NF08KJg2BClaVdEYupe0eYNwTiBugp6aw0/Oj5LsYLxH/Vqf/Nb8l6b6J3IFMq/hnRd/as8yOB8R2/RKb/Ob8kv5K41VttUupactdplGfN7rL07kJfR/wCynwwc/s2eYjgPETp9IU48eS75rVYFhMmF0LaaWZsr2uLi5rbA37hr4LSchHIUpxzPorvLdrTK9sdkuVTuQjkKZWQcvcLnos7inB+H4hVSVLzURyyG7jG+wJ77FbDk2RylxpP2SmnPo83m4AjbrDiVS3we1h/AKXw5w1V4VWyytqm1Eb2BrmiOxBvob381vDGOoumJ6SGYWkZp4GxXFCT2iTy21psgVbKo4bUCnaTKY3BgcbC5Gmtl5TLgOOxWvQskGxyTtPxIXr5w2Ef9UjudK4j3FAoYxo1gATJKv2dx5Xj9HkMNXHRSnmRyxSAWOdtvirGnxyEgN5+wt0P4r000LHaOAI7iFHmwOim/O0lO/wDajBVD463tMv8A7Sa1S2YRuKwP/wB4z+8z5KBWZHNzxzMcA49k9LrfP4RwZ++Hwj9huX4LmLg7CGBwNKHNJ1a5xcPcVyuPVe2dnkxPpHnOUdWRu8SwFSqIR53fVMbp0FlvH8GYM/1aJrf2HFvwTtJwjhVNLzY4pC4aDNISEXHr/Sb5ktejN4fhdViFsjMkF/zh09wWpw7B4KMWY27+r3akq1jgDWiwt3BOCNaJhSZMmWrGmNyiy7snAxGRSKiYhCEAIQhACEIQAhCEAJLJUIBLIslQgEsjTvSqFWYjTUbmMmeQ92zQLki4F/vQEzRGirajG6GFmYylwLHPGRpOg3XX0xQB5YaltwS0jKdwbfHRAWGneiwVczGaJ7Gu51idmlpv0089R713DitJLAJhKA3M5nkRv7kBNLbpDGFCGMUHMEfPAebaFp63tfTT1T7k7U1kcXKOV0jXyCO8djY3t/PkUA/ywkMYVb9NR5LmnndYOu1rbuaW6EWCSXH6WEOc5slgWgED1rtLrjvFgdUBZGJt90ckKv8ApuCwfkeIydXm1g2xId5WBTtJi1PUzsgjDw58ecZht338ibHx0QEvkhHKTwQgGOUl5SeQgGeX4JOX4J9CAZ5fglEadQgGxGEuQLtCAEIQgBCEIAQhCAEIQgBCEIAQhCAFHqKWnmkZJLCx74/ULhctQhAMfRGHZS30OGzgQez0O/xXbcPpAw2p4+1qezuSbn79UIQDP0bQgEikhBF7dnaxHyHuTn0dRDMBSxAB17BvU7oQgB2HUTGlwpYuyP1B4n/6d7yu5qWnnfG+aFj3R6sJG190IQHLaGlibkjgja1wLSAOm/4Lk4ZQyHt0sRGmhbfoRbys4+8pUIBW0NIwua2miAJNxkGtxr713BSU9OS6CFkbg3Ldo6XJt7yT7UIQEkbJUIQAhCEAIQhACEIQAhCEB//Z",
          description: v.description || "No description available",
        }))
        setVendors(formatted)
      } catch (err) {
        console.error("Failed to fetch vendors:", err)
      }
    }

    fetchVendors()
  }, [])

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  const handleChat = (vendorId: string) => {
    navigate(`/chat/${vendorId}`)
  }

  const handleViewDetails = (vendorId: string) => {
    navigate(`/vendor/${vendorId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Contact Vendors</h1>

        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search vendors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-48 relative">
                  <img
                    src={vendor.imageUrl}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{vendor.businessName}</h2>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center">
                          <StarRating rating={vendor.rating} />
                          <span className="ml-2 text-gray-600">
                            {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
                          </span>
                        </div>
                        {vendor.specialties && vendor.specialties.length > 0 && (
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                            {vendor.specialties[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleViewDetails(vendor.id)} className="bg-[#120727] text-white hover:bg-[#1d0b3d] transition-colors">
                        <Info size={20} className="mr-2" />
                        Details
                      </Button>
                      <Button onClick={() => handleChat(vendor.id)} className="bg-[#120727] text-white hover:bg-[#1d0b3d] transition-colors">
                        <MessageCircle size={20} className="mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={18} className="mr-2 flex-shrink-0" />
                    <span>{vendor.address}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <Phone size={18} className="mr-2 flex-shrink-0" />
                    <span>{vendor.phone}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {vendor.specialties.map((specialty, index) => (
                      <span key={index} className="bg-[#120727] text-white px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-8 text-gray-500">No vendors found matching your search criteria.</div>
        )}
      </div>
    </div>
  )
}

export default ContactVendors
