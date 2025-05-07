import os
import sys
import face_recognition

def get_face_encoding(image_path):
    image_path = os.path.abspath(os.getcwd() + "/../" + image_path)
    if not os.path.exists(image_path):
        # print("YO'L TOPILMADI:", image_path)
        return None
    
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)
    if len(encodings) == 0:
        print("YO'Z TOPILMADI:", encodings)
        return None
    return encodings[0]

def main():
    current_directory = os.getcwd()
    print("Current working directory:", current_directory)
    if len(sys.argv) < 3:
        print("Usage: python face_matcher.py <known_image_path> <unknown_image_path>")
        return

    known_image_path = sys.argv[1]
    unknown_image_path = sys.argv[2]

    known_encoding = get_face_encoding(known_image_path)
    unknown_encoding = get_face_encoding(unknown_image_path)


    if known_encoding is None or unknown_encoding is None:
        # print("0")  # yuz topilmadi
        return 0

    distance = face_recognition.face_distance([known_encoding], unknown_encoding)
    # print(distance)

    # threshold: 0.6 dan past bo'lsa bir odam deb qabul qilamiz
    if distance[0] < 0.6:
        # print(f"Match! Distance: {round(distance[0], 4)}")
        return 1
        return f"Match! Distance: {round(distance[0], 4)}"
    else:
        print(f"No Match. Distance: {round(distance[0], 4)}")
        return 0
        return f"No Match. Distance: {round(distance[0], 4)}"

if __name__ == "__main__":
    # main()
    # print("salomlarrrr")
    sys.stdout.reconfigure(encoding='utf-8')
    print(main())  # Chiqishni UTF-8 formatda qaytaring
