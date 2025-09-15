import Project

def main():
    try:
        Project.execute()
        Project.project.run(debug = True, port= 8001)
    except Exception as e:
        print(e)

if __name__ == "__main__":
    main()