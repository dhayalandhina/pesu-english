from PIL import Image, ImageDraw, ImageFilter
S=1024
img=Image.new("RGBA",(S,S),(0,0,0,0))
# macOS-style squircle-ish rounded square with soft shadow
shadow=Image.new("RGBA",(S,S),(0,0,0,0)); sd=ImageDraw.Draw(shadow)
sd.rounded_rectangle((100,118,924,942),radius=190,fill=(10,20,60,110))
shadow=shadow.filter(ImageFilter.GaussianBlur(22)); img.alpha_composite(shadow)
bg=Image.new("RGBA",(S,S),(0,0,0,0)); g=ImageDraw.Draw(bg)
for y in range(100,925):
    t=(y-100)/824
    c=(int(31+(46-31)*t),int(69+(91-69)*t),int(196+(224-196)*t),255)
    g.line([(100,y),(924,y)],fill=c)
mask=Image.new("L",(S,S),0); ImageDraw.Draw(mask).rounded_rectangle((100,100,924,924),radius=190,fill=255)
img.paste(bg,(0,0),mask)
d=ImageDraw.Draw(img)
# speech bubble
d.rounded_rectangle((232,250,792,640),radius=120,fill=(255,255,255,255))
d.polygon([(330,610),(300,770),(470,628)],fill=(255,255,255,255))
# "text" lines in ink blue + red pen tick
d.rounded_rectangle((322,370,702,410),radius=20,fill=(31,69,196,255))
d.rounded_rectangle((322,470,602,510),radius=20,fill=(31,69,196,255))
d.line([(632,500),(662,530),(722,452)],fill=(195,48,42,255),width=30,joint="curve")
img.save("public/icons/icon-1024.png")
img.resize((512,512),Image.LANCZOS).save("public/icons/icon-512.png")
img.resize((192,192),Image.LANCZOS).save("public/icons/icon-192.png")
img.save("/tmp/AppIcon.icns", sizes=[(16,16),(32,32),(64,64),(128,128),(256,256),(512,512),(1024,1024)])
print("ok")
