EXTENSION_NAME=eveseliba_helper
VERSION=$(shell jq -r '.version' manifest.json)
XPI_FILE=$(EXTENSION_NAME)-$(VERSION).xpi
SOURCES=css/style.css icons/copy-prescription.png img/check-24.png img/copy-regular-24.png main.js manifest.json

.PHONY: all clean

all: $(XPI_FILE)

$(XPI_FILE): $(SOURCES)
	@echo "Packaging extension into $(XPI_FILE)..."
	zip -r $(XPI_FILE) $(SOURCES)
	@echo "Done."

clean:
	@echo "Cleaning up..."
	rm -f $(XPI_FILE)
	@echo "Done."

