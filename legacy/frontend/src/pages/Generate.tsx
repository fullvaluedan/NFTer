import { useState } from 'react'
import { generateAvatar } from '../services/api'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel'
import { toast } from 'sonner'
import { Download } from 'lucide-react'

const ROLES = [
  {
    label: "civilian villager",
    weight: 40,
    score: [5, 35],
    prompt: "Naruto-style anime portrait of a Hidden Leaf Village civilian. Close-up head and shoulders. Wearing modern ninja-world casual clothes like a hooded vest, layered shirt, or light tunic in greens, browns, or muted colors. No forehead protector. Hair should be practical or spiky. Calm or cheerful expression. Background: wooden buildings, hanging signs, laundry lines, or village streets — softly blurred with warm lighting."
  },
  {
    label: "young Genin",
    weight: 20,
    score: [30, 55],
    prompt: "Close-up anime portrait of a newly graduated ninja. Wearing a headband, fingerless gloves, and a short-sleeve tactical shirt. Wide, hopeful eyes. Background: sunny training ground with trees and logs, lightly blurred."
  },
  {
    label: "Chūnin",
    weight: 15,
    score: [45, 65],
    prompt: "Close-up head-and-shoulders portrait of a mid-ranked ninja. Wearing green tactical flak jacket, serious but kind expression. Headband clearly visible. Background: village street near mission office, stylized blur."
  },
  {
    label: "elite Jōnin",
    weight: 10,
    score: [55, 75],
    prompt: "Anime portrait of an elite ninja. Wearing flak vest over long-sleeve black ninja gear, with visible forehead protector. Sharp, confident look. Background: distant mountains and trees, artistically blurred."
  },
  {
    label: "Rogue ninja",
    weight: 4,
    score: [60, 80],
    prompt: "Anime portrait of a rogue ninja. Close-up face and shoulders. Wearing a slashed headband, torn cloak, grim expression. Background: rocky ruins or broken bridge, cloudy sky, desaturated blur."
  },
  {
    label: "Akatsuki member",
    weight: 3,
    score: [75, 95],
    prompt: "Close-up anime portrait of a mysterious group member. Wearing iconic black cloak with red clouds, slashed headband, and intense red or purple eyes. Background: lightning-lit sky and crumbled temple in far distance, blurred."
  },
  {
    label: "Anbu Black Ops",
    weight: 3,
    score: [70, 90],
    prompt: "Close-up portrait of a special ops ninja. Wearing black armor, flak vest, and a cat-style mask held at their side. Headband visible. Eyes serious and alert. Background: high rooftops at night, village skyline behind mist."
  },
  {
    label: "Hidden Leaf teacher",
    weight: 3,
    score: [50, 70],
    prompt: "Anime portrait of an academy teacher. Wearing a dark tunic with scroll pouch, holding a chalk or lesson scroll. Warm, kind expression. Background: wooden training yard fence and academy windows, softly blurred."
  },
  {
    label: "Hokage",
    weight: 2,
    score: [90, 100],
    prompt: "Close-up anime portrait of a village leader. Wearing the traditional white cloak with red flame trim and leader's headpiece. Calm and wise smile. Background: the monument of past leaders, softly blurred."
  }
]

const Generate = () => {
  const [file, setFile] = useState<File | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>("random")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [imageScores, setImageScores] = useState<number[]>([])
  const [selectedRoleLabel, setSelectedRoleLabel] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile)
    } else {
      toast.error('Please drop an image file')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !selectedRole) {
      toast.error('Please select both an image and a role')
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("selected_role", selectedRole === "random" ? "" : selectedRole)

      const response = await generateAvatar(formData)
      setGeneratedImages(response.image_urls)
      setImageScores(response.scores)
      setSelectedRoleLabel(response.role)
      toast.success('Your avatars have been generated!')
    } catch (err) {
      console.error("Error generating avatar:", err)
      toast.error('Failed to generate avatar. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score <= 30) return "bg-red-500"
    return "bg-yellow-500"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="mb-3 font-sans text-4xl font-bold text-yellow-500 drop-shadow-lg">
          NFTer
        </h1>
        <p className="text-lg text-muted-foreground">Add yourself to any community</p>
      </header>

      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-lg border border-blue-500 bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block ">
                Choose a role (or leave random)
              </label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random (weighted)</SelectItem>
                  {ROLES.map((role) => (
                    <SelectItem key={role.label} value={role.label}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block ">
                Select an image to transform
              </label>
              <div
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors
                  ${isDragging 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your image here, or click to select
                  </p>
                  {file && (
                    <p className="">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Transforming..." : "Transform Image"}
            </Button>
          </form>

          {isLoading && (
            <div className="mt-6 text-center">
              <p>Transforming your image...</p>
              <div className="mx-auto my-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">
                This might take up to a minute depending on the image size.
              </p>
            </div>
          )}

          {generatedImages.length > 0 && (
            <div className="mt-6 space-y-4">
              <h5 className="text-center text-lg font-semibold">Your Transformed Images</h5>
              <div className="rounded-lg bg-blue-500/10 p-4 text-center">
                <p className="mb-0">
                  Your character has been transformed into <strong>{selectedRoleLabel}</strong>!
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="text-center">
                  <Carousel className="mx-auto max-w-[400px]">
                    <CarouselContent>
                      {generatedImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <img
                              src={image}
                              alt={`Generated Avatar ${index + 1}`}
                              className="mx-auto max-h-[400px] w-auto rounded-lg object-contain"
                            />
                            {imageScores[index] && (
                              <div className="mt-4">
                                <h6 className="mb-2">Power Level: {imageScores[index]}%</h6>
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                                  <div
                                    className={`h-full ${getScoreColor(imageScores[index])} transition-all duration-500`}
                                    style={{ width: `${imageScores[index]}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>

                  <a
                    href={generatedImages[0]}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2  text-white hover:bg-green-600"
                  >
                    <Download className="h-4 w-4" />
                    Download Image
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h5 className="mb-3 text-lg font-semibold">About this tool</h5>
          <p className="mb-4 text-sm text-muted-foreground">
            This tool uses advanced AI technology to transform your photos and add you to any community. The transformation is powered by cutting-edge image generation models.
          </p>
          <p className="text-sm text-muted-foreground">
            The process may take some time depending on the complexity of your image and the current server load.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Generate 